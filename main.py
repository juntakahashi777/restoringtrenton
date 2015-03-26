import os
import urllib
import jinja2
import webapp2
import json

with open('server_config.json') as config_file:
	server_config = json.load(config_file)

JINJA_ENVIRONMENT = jinja2.Environment(
	loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
	extensions=['jinja2.ext.autoescape'],
	autoescape=True)


class MainHandler(webapp2.RequestHandler):
	def get(self):
		template = JINJA_ENVIRONMENT.get_template('templates/map_main.html')

		template_values = {
			'query_addr': self.request.get('query_addr')
		}

		self.response.write(template.render(template_values))

class FeedbackHandler(webapp2.RequestHandler):
	def get(self):
		address_var = str(server_config['feedback_address_var'])
		address_value = str(self.request.get('address'))
		url = 'https://docs.google.com/forms/d/1gEWl28gtcfvVr1-2D9e9yf556mKnvN2KBSUol6t1hnY/viewform' \
			+ '?' + address_var+ '=' + address_value
		self.redirect(url)


app = webapp2.WSGIApplication([
	('/', MainHandler),
	('/feedback', FeedbackHandler)
	], debug=True)
