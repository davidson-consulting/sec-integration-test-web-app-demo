from selenium.webdriver.support.ui import WebDriverWait
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys

import random
import sys
import time
import socket
import os
import traceback
import logging
import json

def start(identifier, pid):
    print('start', pid, identifier)
    UDP_IP, UDP_PORT = 'localhost', 2000
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    sock.sendto(bytes('start ' + str(pid) + ' ' + identifier, encoding='utf-8'), (UDP_IP, UDP_PORT))
    data, addr = sock.recvfrom(1024)
    print(data, addr)
    sock.close()

def stop(identifier):
    print('stop', identifier)
    UDP_IP, UDP_PORT = 'localhost', 2000
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    sock.sendto(bytes('stop ' + identifier, encoding='utf-8'), (UDP_IP, UDP_PORT))
    data, addr = sock.recvfrom(1024)
    print(data, addr)
    sock.close()

def report(path):
    print('report', path)
    UDP_IP, UDP_PORT = 'localhost', 2000
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    sock.sendto(bytes('report ' + path, encoding='utf-8'), (UDP_IP, UDP_PORT))
    data, addr = sock.recvfrom(1024)
    print(data, addr)
    sock.close()

def init():
    words = []
    with open('/usr/share/dict/words', 'r') as words_file:
        all_words = words_file.readlines()
        for word in all_words:
            if not '\'' in word:
                words.append(word)
    driver = webdriver.Chrome()
    time.sleep(1)
    return driver, words

def end(driver):
    driver.quit()

def inject_random_word_in_text_by_id(id, driver, words):
    random_word = words[random.randrange(0, len(words))]
    WebDriverWait(driver, 5).until(lambda d: d.find_element(by=By.ID, value=id)).send_keys(random_word)
    return random_word

def inject_given_word_in_text_by_id(id, driver, word):
    WebDriverWait(driver, 5).until(lambda d: d.find_element(by=By.ID, value=id)).send_keys(word)

def click_on_button_by_id(id, driver):
    WebDriverWait(driver, 5).until(lambda d: d.find_element(by=By.ID, value=id)).click()

def test_signup(driver, words, url):
    driver.get(url)
    time.sleep(1)
    click_on_button_by_id('signup_button', driver)
    time.sleep(1)
    lastname = inject_random_word_in_text_by_id('lastname', driver, words)
    time.sleep(0.25)
    fisrtname = inject_random_word_in_text_by_id('firstname', driver, words)
    time.sleep(0.25)
    age = inject_random_word_in_text_by_id('age', driver, words)
    time.sleep(0.25)
    password = inject_random_word_in_text_by_id('password', driver, words)
    time.sleep(1)
    click_on_button_by_id('signup_button', driver)
    time.sleep(0.25)
    inject_given_word_in_text_by_id('username', driver, lastname)
    time.sleep(0.25)
    inject_given_word_in_text_by_id('password', driver, password)
    time.sleep(1)
    click_on_button_by_id('login_button', driver)
    time.sleep(2)

def test(pid_front, pid_back, test_name, test_function, driver, words, url):
    start('frontend', pid_front)
    start('backend', pid_back)
    try:
        test_function(driver, words, url)
    except Exception as e:
        logging.error(traceback.format_exc())    
    stop('frontend')
    stop('backend')
    report(os.getcwd() + '/reports/report_' + test_name +'.json')

if __name__ == '__main__':

    pid_front = sys.argv[1]
    pid_front_no_mat = sys.argv[2]
    pid_back = sys.argv[3]

    driver, words = init()
    reports = {}

    test_names = ['test_signup_mat', 'test_signup_no_mat']
    pids_front = {}
    pids_front[test_names[0]] = pid_front
    pids_front[test_names[1]] = pid_front_no_mat
    urls_front = {}
    urls_front[test_names[0]] = 'http://localhost:4200'
    urls_front[test_names[1]] = 'http://localhost:4201'

    for test_name in test_names:
        test(pids_front[test_name], pid_back, test_name, test_signup, driver, words, urls_front[test_name])
        with open(os.getcwd() + '/reports/report_' + test_name +'.json', 'r') as report_file:
            reports[test_name] =  json.loads(report_file.read())

    end(driver)
    for test_name in reports:
        print(test_name)
        for component in reports[test_name]:
            print(json.dumps(reports[test_name][component], indent=4))
    