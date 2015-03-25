import os
import urllib
import jinja2
import webapp2

JINJA_ENVIRONMENT = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
    extensions=['jinja2.ext.autoescape'],
    autoescape=True)


class MainHandler(webapp2.RequestHandler):
    def get(self):
    	template = JINJA_ENVIRONMENT.get_template('templates/map_main.html')
        self.response.write(template.render())

class FeedbackHandler(webapp2.RequestHandler):
	def get(self):
		template = JINJA_ENVIRONMENT.get_template('templates/feedback.html')

		template_values = {'latlng': self.request.get('latlng') }

		url = 'https://docs.google.com/forms/d/1gEWl28gtcfvVr1-2D9e9yf556mKnvN2KBSUol6t1hnY/viewform' \
			+ '?entry.439758060=' + str(self.request.get('latlng'))
		self.redirect(url)


app = webapp2.WSGIApplication([
    ('/', MainHandler),
    ('/feedback', FeedbackHandler)
], debug=True)
