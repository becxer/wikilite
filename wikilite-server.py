from flask import Flask, render_template
import sys, json, os
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
    max_num = config['bookpage-maxnum']
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

def parse_readme(readme_path):
    with open(readme_path) as rmd:
        content = rmd.read()
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
            elif fname == "_posts" and os.path.isdir(fpath):
                book_page_list = os.listdir(fpath)
                for page_name in book_page_list:
                    page_path = os.path.join(fpath, page_name)
                    page = parse_page(page_path)
                    page['page_name'] = page_name
                    book['pages'].append(page)

@app.route("/")
def index():
    intro_md = parse_readme(config['intro-md'])
    sidetip_md = parse_readme(config['sidetip-md'])
    return render_template(
        "index.html",
        web_title=web_title,
        web_dirs=web_dirs,
        dir_readme=intro_md['content'],
        side_tip=sidetip_md['content'],
        is_intro=True
    )

@app.route("/reload")
def reload_all():
    global root, library_root, library_dir, web_title, web_dirs
    reload_config()
    library_dir = {library_root : {}}
    root = library_dir[library_root]
    update_library(root)
    parse_library(root)
    web_title = config["web-title"]
    web_dirs = list(root.keys())
    return "reloaded"

@app.route("/book_readme/<string:book_name>/")
def book(book_name):
    print(root[book_name])
    return json.dumps(root[book_name]['readme'])

@app.route("/book_pages/<string:book_name>/<int:num>/")
def book_page(book_name, num):
    page_list = root[book_name]['pages']
    return json.dumps(page_list[num * max_num : num * max_num + max_num])

@app.route("/page/<string:book_name>/<string:page_name>/")
def page(book_name, page_name):
    for page in root[book_name]['pages']:
        print(page['page_name'])
        if page['page_name'] == page_name:
            print(page)
            return json.dumps(page)

dummy = reload_all()
print(config)

if __name__ == "__main__":
    app.run()
