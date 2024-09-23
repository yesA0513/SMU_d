import requests
from bs4 import BeautifulSoup
import json

def scrape_menu():
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'}
    breakfast = requests.get('https://www.smu.ac.kr/kor/life/restaurantView.do?mode=menuList&srMealCategory=B', headers=headers)
    lunch = requests.get('https://www.smu.ac.kr/kor/life/restaurantView.do?mode=menuList&srMealCategory=L', headers=headers)

    break_soup = BeautifulSoup(breakfast.text, 'html.parser')
    lunch_soup = BeautifulSoup(lunch.text, 'html.parser')

    seoul_breakfast = break_soup.select('#jwxe_main_content > div:nth-child(2) > div > div > div > div > table > tbody')
    seoul_lunch = lunch_soup.select('#jwxe_main_content > div:nth-child(2) > div > div > div > div > table > tbody')

    return seoul_breakfast, seoul_lunch

def parse_breakfast(seoul_breakfast):
    breakfast_menu = []
    for day in range(5):  # 월요일부터 금요일까지
        day_menu = []
        menu_items = seoul_breakfast[0].find_all('td')[day].find_all('li')
        for item in menu_items:
            if not item.text.startswith('['):  # 시간 정보 제외
                day_menu.append(item.text.strip())
        breakfast_menu.append(day_menu[:2])  # 각 날짜별로 최대 2개 메뉴 항목만 저장
    return breakfast_menu

def parse_lunch(seoul_lunch):
    lunch_menu = []
    for day in range(5):  # 월요일부터 금요일까지
        day_menu = []
        menu_items = seoul_lunch[0].find_all('td')[day].find_all('li')
        for item in menu_items:
            if not item.text.startswith('['):  # 메뉴 이름 정보만 추출
                day_menu.append(item.text.strip())
        lunch_menu.append(day_menu)
    return lunch_menu

def create_menu_json():
    seoul_breakfast, seoul_lunch = scrape_menu()
    
    menu = {
        "seoul": {
            "breakfast": parse_breakfast(seoul_breakfast),
            "lunch": parse_lunch(seoul_lunch)
        },
        "cheonan": {
            "student": {
                "breakfast": [["천안 학생식당 조식 메뉴 데이터 없음"] * 2 for _ in range(5)],
                "lunch": [["천안 학생식당 중식 메뉴 데이터 없음"] * 2 for _ in range(5)]
            },
            "staff": [["천안 교직원 메뉴 데이터 없음"] * 2 for _ in range(5)]
        }
    }

    with open('menu.json', 'w', encoding='utf-8') as f:
        json.dump(menu, f, ensure_ascii=False, indent=2)

    print("메뉴 정보가 menu.json 파일로 저장되었습니다.")

create_menu_json()