#!/usr/bin/env python

import nltk
import sys
import flickrapi
import random
import json

class Poemtic():

	def __init__(self, flickr_api_key):
		self.attempts = 0
		self.flickr_api_key = flickr_api_key
		
	def big_words(self,sentence):
		words = []
		tokens = nltk.tokenize.word_tokenize(sentence)
		for word in nltk.tag.pos_tag(tokens):
			if word[1] in [
				'JJ',
				'JJR',
				'JJS',
				'NN',
				'NNS',
				'NNP',
				'NNPS',
				'RB',
				'RBR',
				'RBS',
				'VB',
				'VBD',
				'VBG',
				'VBN',
				'VBP',
				'VBZ'
				]:
				words.append(word[0])
		return words

	def random_word(self, sentence):
		words = self.big_words(sentence)
		if len(words):
			index = int(random.uniform(0,len(words)))
			return words[index]
		return ''

	def flickr_user(self, uid):
		user = {}
		flickr = flickrapi.FlickrAPI(self.flickr_api_key)
		info = flickr.people_getInfo(user_id=uid)
		try:
			person = info.find('person')
			user['name'] = person.findall('username')[0].text
			user['real'] = person.findall('realname')[0].text
			user['url'] = person.findall('photosurl')[0].text
		except IndexError, e:
			pass
		return user
		

	def image(self, sentence):
		self.attempts += 1
		data = {'url':''}
		data['word'] = self.random_word(sentence)
		flickr = flickrapi.FlickrAPI(self.flickr_api_key)
		photos = flickr.photos_search(
			tags=data['word'],
			per_page=500,
			license='2,3,4,6,7',
			content_type=1)
		index = int(random.uniform(0,500))
		try:
			p = photos.find('photos').findall('photo')[index]
			data['url'] = 'http://farm%(farm)s.staticflickr.com/%(server)s/%(id)s_%(secret)s.jpg' % p.attrib
			data['square'] = 'http://farm%(farm)s.staticflickr.com/%(server)s/%(id)s_%(secret)s_s.jpg' % p.attrib
			data['page'] = 'http://www.flickr.com/photos/%(owner)s/%(id)s' % p.attrib
			data['user'] = self.flickr_user(p.attrib['owner'])
		except IndexError, e:
			if self.attempts < 2:
			   return self.image(sentence)
			pass
		return json.dumps(data)


