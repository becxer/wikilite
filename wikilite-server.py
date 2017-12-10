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

source_root = config["source-root"]
if not os.path.exists(source_root):
    os.makedirs(source_root)

comment_root = config["comment-root"]
if not os.path.exists(comment_root):
    os.makedirs(comment_root)
    
def update_source():
    source_giturls = config["source-giturls"]
    print("source updating...")
    for giturl in tqdm(source_giturls):
        title = giturl.split("/")[-1]
        if ".git" in title:
            title = title[:-4]
        tab_path = os.path.join(source_root, title)
        if not os.path.exists(tab_path):
            process = subprocess.Popen(["git", "clone", giturl, tab_path])
            output = process.communicate()[0]
        else:
            process = subprocess.Popen(["git", "-C", tab_path, "fetch", "origin"])
            output = process.communicate()[0]
            process = subprocess.Popen(["git", "-C", tab_path, "reset", "--hard", "origin/master"])
            output = process.communicate()[0]

update_source()
sys.exit()

@app.route("/")
def index():
    return "Index!"

@app.route("/tab/<string:tab_name>/")
def tab(tab_name):
    return

@app.route("doc/<string:tab_name>/<string:doc_name>/")
def doc(tab_name, doc_name):
    return

if __name__ == "__main__":
    app.run()
