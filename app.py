import web
import re
import base64
from visipo import Visipo

urls = (
	'/','Index',
	'/login','Login',
	'/word', 'Word',
)

app = web.application(urls,globals())

allowed = (
    ('enrudo','hiyakawaka'),
)

def login_required(func):
	def f(self):
		if web.ctx.env.get('HTTP_AUTHORIZATION') is not None:
			return func(self)
		else:
			raise web.seeother('/login')
	return f

class Index:
	@login_required
	def GET(self):
		return 'This is the index page'

class Login:
    def GET(self):
        auth = web.ctx.env.get('HTTP_AUTHORIZATION')
        authreq = False
        if auth is None:
            authreq = True
        else:
            auth = re.sub('^Basic ','',auth)
            username,password = base64.decodestring(auth).split(':')
            if (username,password) in allowed:
                raise web.seeother('/')
            else:
                authreq = True
        if authreq:
            web.header('WWW-Authenticate','Basic realm="Auth example"')
            web.ctx.status = '401 Unauthorized'
            return

class Word:
	def POST(self):
		i = web.input()
		v = Visipo('1c9999f58ecae73d1fcb474014fa1edc')
		return v.image(i.data)

if __name__=='__main__':
    app.run()

