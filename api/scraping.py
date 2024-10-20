import requests
from bs4 import BeautifulSoup
import json
import os

def scrape_menu():
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'}
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
        breakfast_menu.append(day_menu)  # 각 날짜별로 최대 2개 메뉴 항목만 저장
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

def read_menu(file_path):
    menu = []
    with open(file_path, 'r', encoding='utf-8') as file:
        lines = file.readlines()
        if not lines:  # 파일이 비어 있을 경우
            return [["정보 없음"]] * 5  # 요일별로 기본 값 설정
    
        for line in lines:
            items = [item.strip() for item in line.split()]
            menu.append(items)
    
    # 만약 읽어온 데이터가 5일치가 되지 않으면 "정보 없음"으로 채워줌
    while len(menu) < 5:
        menu.append(["정보 없음"])
    
    return menu

def create_menu_json():
    seoul_breakfast, seoul_lunch = scrape_menu()
    
    # 텍스트 파일에서 천안 캠퍼스 데이터 읽기 (파일이 없거나 내용이 없는 경우 "정보 없음" 추가)
    cheonan_student_breakfast = read_menu("menu_info/b_menu.txt")
    cheonan_student_lunch = read_menu("menu_info/l_menu.txt")
    cheonan_staff = read_menu("menu_info/s_menu.txt")

    menu = {
        "seoul": {
            "breakfast": parse_breakfast(seoul_breakfast),
            "lunch": parse_lunch(seoul_lunch)
        },
        "cheonan": {
            "student": {
                "breakfast": cheonan_student_breakfast,
                "lunch": cheonan_student_lunch
            },
            "staff": cheonan_staff
        }
    }

    with open('menu_info/menu.json', 'w', encoding='utf-8') as f:
        json.dump(menu, f, ensure_ascii=False, indent=2)

    print("메뉴 정보가 menu_info/menu.json 파일로 저장되었습니다.")

if __name__ == "__main__":
    # menu_info 디렉토리가 없으면 생성
    os.makedirs('menu_info', exist_ok=True)
    create_menu_json()

import requests
from bs4 import BeautifulSoup
import json
import os

def scrape_menu():
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'}
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
        breakfast_menu.append(day_menu)  # 각 날짜별로 최대 2개 메뉴 항목만 저장
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

def read_menu(file_path):
    menu = []
    with open(file_path, 'r', encoding='utf-8') as file:
        lines = file.readlines()
        if not lines:  # 파일이 비어 있을 경우
            return [["정보 없음"]] * 5  # 요일별로 기본 값 설정
    
        for line in lines:
            items = [item.strip() for item in line.split()]
            menu.append(items)
    
    # 만약 읽어온 데이터가 5일치가 되지 않으면 "정보 없음"으로 채워줌
    while len(menu) < 5:
        menu.append(["정보 없음"])
    
    return menu

def create_menu_json():
    seoul_breakfast, seoul_lunch = scrape_menu()
    
    # 텍스트 파일에서 천안 캠퍼스 데이터 읽기 (파일이 없거나 내용이 없는 경우 "정보 없음" 추가)
    cheonan_student_breakfast = read_menu("menu_info/b_menu.txt")
    cheonan_student_lunch = read_menu("menu_info/l_menu.txt")
    cheonan_staff = read_menu("menu_info/s_menu.txt")

    menu = {
        "seoul": {
            "breakfast": parse_breakfast(seoul_breakfast),
            "lunch": parse_lunch(seoul_lunch)
        },
        "cheonan": {
            "student": {
                "breakfast": cheonan_student_breakfast,
                "lunch": cheonan_student_lunch
            },
            "staff": cheonan_staff
        }
    }

    with open('menu_info/menu.json', 'w', encoding='utf-8') as f:
        json.dump(menu, f, ensure_ascii=False, indent=2)

    print("메뉴 정보가 menu_info/menu.json 파일로 저장되었습니다.")

if __name__ == "__main__":
    # menu_info 디렉토리가 없으면 생성
    os.makedirs('menu_info', exist_ok=True)
    create_menu_json()
