import requests
from bs4 import BeautifulSoup

headers = {'User-Agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'}
breakfast = requests.get('https://www.smu.ac.kr/kor/life/restaurantView.do?mode=menuList&srMealCategory=B',headers=headers)
lunch = requests.get('https://www.smu.ac.kr/kor/life/restaurantView.do?mode=menuList&srMealCategory=L',headers=headers)

break_soup = BeautifulSoup(breakfast.text, 'html.parser')
lunch_soup = BeautifulSoup(lunch.text, 'html.parser')

seoul_breakfast = break_soup.select('#jwxe_main_content > div:nth-child(2) > div > div > div > div > table > tbody')
seoul_lunch = lunch_soup.select('#jwxe_main_content > div:nth-child(2) > div > div > div > div > table > tbody')

print(seoul_breakfast)
print(seoul_lunch)