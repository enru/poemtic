#!/usr/bin/env python

import nltk
import sys
import flickrapi
import random

class Visipo():

	def __init__(self, flickr_api_key):
		self.flickr_api_key = flickr_api_key
		
	def nouns_and_verbs(self,sentence):
		words = []
		tokens = nltk.tokenize.word_tokenize(sentence)
		for word in nltk.tag.pos_tag(tokens):
			if word[1] not in ['DT', 'IN', 'VBZ']:
				words.append(word[0])
		return words

	def random_word(self, sentence):
		words = self.nouns_and_verbs(sentence)
		return words[int(random.uniform(0,len(words)))]

	def image(self, sentence):
		word = self.random_word(sentence)
		flickr = flickrapi.FlickrAPI(self.flickr_api_key)
		photos = flickr.photos_search(
			tags=word,
			per_page=500,
			content_type=1)
		index = int(random.uniform(0,500))
		try:
			p = photos.find('photos').findall('photo')[index]
		except IndexError, e:
			return ''
		return 'http://farm%(farm)s.staticflickr.com/%(server)s/%(id)s_%(secret)s.jpg' % p.attrib


