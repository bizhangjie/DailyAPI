from flask import Flask, render_template
from utils.Response import Response
from api.jable import Jable

app = Flask(__name__)

# 示例配置
app.config['DEBUG'] = True

@app.route('/')
def home():
    """首页路由处理函数"""
    return render_template('index.html')

@app.route('/jable/get_m3u8/<uid>')
def get_m3u8(uid):
    """获取m3u8路由处理函数"""
    try:
        api = Jable("测试")
        m3u8_data = api.get_m3u8(uid)
        return Response.success(m3u8_data)
    except Exception as e:
        return Response.error(str(e))

@app.route('/jable/search/<wd>/<int:typ>/<int:pg>')
def get_search(wd, typ, pg):
    """搜索功能"""
    try:
        api = Jable("搜索")
        return Response.success(api.get_search(wd, typ, pg))
    except Exception as e:
        return Response.error(str(e))

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=9999)
