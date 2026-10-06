# hey pumpkin <3 — final anniversary site

this is the full flask project built around your renamed google drive media

## run it on your computer

1. install python 3.11 or newer
2. open a terminal in this folder
3. run:

   pip install -r requirements.txt
   python app.py

4. open http://127.0.0.1:5000 on your phone or computer

## google drive media

the site uses the google drive file ids from the shared folder you organized
the `1` image is used as the cover when available and the rest open inside that memory gallery

the drive folder/files must remain viewable by anyone with the link for a deployed public site to display the images and videos

## music

i did not package copyrighted commercial songs into the project

the site includes the soundtrack section and the project is prepared for these optional files under `static/music/`

- aquel_nap_zzz.mp3
- blessed.mp3
- u_plus_me.mp3
- it_had_to_be_you.mp3

only add audio copies you are allowed to use
the current site works without them

## easiest deployment

render is a good option for a flask site

build command:
pip install -r requirements.txt

start command:
gunicorn app:app

you can also deploy to pythonanywhere or another flask host

## safest things to edit

`site_data.json` contains almost all words timeline content media references trivia notes and year two items

`templates/index.html` controls the page structure
`static/css/style.css` controls the look
`static/js/app.js` controls interactions

if you want changes it is safer to ask chatgpt to edit the project than to change the javascript yourself

## important

the website was designed mobile first because heyzel will open it on her phone


## update october 5

- new cover images added for kiss incident thanksgiving christmas first i love you and amazing dates with my love
- amazing dates with my love now opens a gallery containing every file labeled extra including videos
- five easter eggs are physically hidden in different sections of the site
- spotify embeds are included for all four relationship songs
- no spotify account connection is needed for the website itself
