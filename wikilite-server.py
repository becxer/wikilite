from flask import Flask
import sys, json, os
from tqdm import tqdm
import subprocess

app = Flask(__name__)

def load_json_from_file(file_path):
    json_file = json.loads(open(file_path,"r").read())
    return json_file

config = load_json_from_file("config.json")
userinfo = load_json_from_file("userinfo.json")
print("config : ", config)

library_root = config["library-root"]
if not os.path.exists(library_root):
    os.makedirs(library_root)

comment_root = config["comment-root"]
if not os.path.exists(comment_root):
    os.makedirs(comment_root)

library_dir = {library_root : {}}
def update_library(root):
    global library_root
    source_giturls = config["library-giturls"]
    print("source updating...")
    for giturl in tqdm(source_giturls):
        title = giturl.split("/")[-1]
        if ".git" in title:
            title = title[:-4]
        root[title] = {}
        tab_path = os.path.join(library_root, title)
        if not os.path.exists(tab_path):
            process = subprocess.Popen(["git", "clone", giturl, tab_path])
            output = process.communicate()[0]
        else:
            process = subprocess.Popen(["git", "-C", tab_path, "fetch", "origin"])
            output = process.communicate()[0]
            process = subprocess.Popen(["git", "-C", tab_path, "reset", "--hard", "origin/master"])
            output = process.communicate()[0]

update_library(library_dir[library_root])
print(library_dir)

def parse_all_mds(root):
    global library_root
    for book_name in root.keys():
        book_root = os.path.join(library_root, book_name)
        book_file_list = os.listdir(book_root)
        for fname in book_file_list:
            fpath = os.path.join(book_root, fname)
            if fname.lower() == "readme.md" and os.path.isfile(fpath):
                readme_path = fpath
                print(readme_path)
            elif fname == "_posts" and os.path.isdir(fpath):
                book_page_list = os.listdir(fpath)
                for page_name in book_page_list:
                    page_path = os.path.join(fpath, page_name)
                    print(page_path)
            
        
parse_all_mds(library_dir[library_root])
sys.exit()

@app.route("/")
def index():
    return "Index!"

@app.route("/book/<string:book_name>/")
def book(book_name):
    return

@app.route("/page/<string:book_name>/<string:page_name>/")
def page(book_name, page_name):
    return

if __name__ == "__main__":
    app.run()
