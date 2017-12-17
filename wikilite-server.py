from flask import Flask, render_template, redirect, url_for
import sys, json, os, math
from tqdm import tqdm
import subprocess
import mistune
import mistune

markdown = mistune.Markdown()
app = Flask(__name__)

config = {} # Configure
root = {} # Books root
library_dir = {} # library_dir {"library_root" : root}

library_root = "" # Real path to library root
comment_root = "" # Real path to comment root

web_title = "" # Configure web title
web_dirs = [] # Configure web dirs

def load_json_from_file(file_path):
    json_file = json.loads(open(file_path,"r").read())
    return json_file

def reload_config():
    global config, userinfo, library_root, comment_root, intro_md, sidetip_md
    config = load_json_from_file("config.json")
    library_root = config["library-root"]
    comment_root = config["comment-root"]
    if not os.path.exists(library_root):
        os.makedirs(library_root)
    if not os.path.exists(comment_root):
        os.makedirs(comment_root)

def update_library(root):
    global library_root
    global library_dir
    library_dir = {library_root : {}}
    source_giturls = config["library-giturls"]
    print("source updating...")
    for giturl in tqdm(source_giturls):
        title = giturl.split("/")[-1]
        if ".git" in title:
            title = title[:-4]
        root[title] = { "title" : title , "pages" : [] }
        tab_path = os.path.join(library_root, title)
        if not os.path.exists(tab_path):
            process = subprocess.Popen(["git", "clone", giturl, tab_path])
            output = process.communicate()[0]
        else:
            process = subprocess.Popen(["git", "-C", tab_path, "fetch", "origin"])
            output = process.communicate()[0]
            process = subprocess.Popen(["git", "-C", tab_path, "reset", "--hard", "origin/master"])
            output = process.communicate()[0]


def parse_page(path):
    with open(path) as page:
        page_res = {}
        content = page.read()
        content_lined = content.split("\n")
        head_count = 0
        for idx, line in enumerate(content_lined):
            if "---" in line:
                head_count += 1
                continue
            if head_count == 1:
                option = line.split(":")
                opt_key = option[0].strip()
                opt_val = ":".join(option[1:]).strip()
                page_res[opt_key] = opt_val
            if head_count >= 2:
                content = "\n".join(content_lined[idx:])
                break
        page_res['content'] = markdown(content)
        return page_res

def parse_readme(readme_path, limit_line=-1):
    with open(readme_path) as rmd:
        content = rmd.read()
        if limit_line > 0:
            content = "\n".join(content.split("\n")[:limit_line])
        return {'content' : markdown(content)}

def parse_library(root):
    global library_root
    for book_name in root.keys():
        book_root = os.path.join(library_root, book_name)
        book_file_list = os.listdir(book_root)
        book = root[book_name]
        for fname in book_file_list:
            fpath = os.path.join(book_root, fname)
            if fname.lower() == "readme.md" and os.path.isfile(fpath):
                readme_path = fpath
                book['readme'] = parse_readme(readme_path)
                book['readme-short'] =  parse_readme(readme_path, limit_line=10)
            elif fname == "_posts" and os.path.isdir(fpath):
                book_page_list = os.listdir(fpath)
                for page_name in book_page_list:
                    page_path = os.path.join(fpath, page_name)
                    page = parse_page(page_path)
                    page['page_name'] = page_name
                    book['pages'].append(page)

@app.route("/reload")
def reload_all(startup=False):
    global root, library_root, library_dir, web_title, web_dirs, config
    reload_config()
    library_dir = {library_root : {}}
    root = library_dir[library_root]
    update_library(root)
    parse_library(root)
    web_title = config["web-title"]
    web_dirs = list(root.keys())
    print(config)
    if startup:
        return True
    return redirect(url_for('index'))

def render_book(book_name, book, book_pages, max_page, is_intro):
    sidetip_md = parse_readme(config['sidetip-md'])
    return render_template(
        "index.html",
        web_title=web_title,
        web_dirs=web_dirs,
        book_name=book_name,
        book=book,
        book_pages=book_pages,
        side_tip=sidetip_md,
        max_page=max_page,
        is_intro=is_intro
    )

@app.route("/")
def index():
    intro_md = parse_readme(config['intro-md'])
    return render_book("/", {'readme' : intro_md}, [], 0, True)

@app.route("/book/<string:book_name>/<int:num>/")
def book(book_name, num):
    max_num = config["bookpage-maxnum"]
    book = root[book_name]
    page_list = book['pages']
    now_page_list = page_list[num * max_num : num * max_num + max_num]
    print(now_page_list)
    max_page = math.ceil(float(len(page_list)) / float(max_num))
    return render_book(book_name, book, now_page_list, max_page, False)

@app.route("/page/<string:book_name>/<string:page_name>/")
def page(book_name, page_name):
    for page in root[book_name]['pages']:
        if page['page_name'] == page_name:
            return page['content']

dummy = reload_all(startup=True)

if __name__ == "__main__":
    port=5000
    if len(sys.argv) == 2:
        port = sys.argv[1]
    app.run(host='0.0.0.0',port=port)
