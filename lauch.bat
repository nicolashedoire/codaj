rem // permet de cacher toutes les commandes
@echo off
rem // permet de customiser la fenetre
mode con cols=80 lines=15
rem // donne un titre à la fenetre
@title Launcher app
rem // efface ecran d'affichage
cls
start chrome "http://localhost:3000"
rem commande pour lancer un chrome vierge
rem commande pour lancer un script nodejs avec nodemon
call nodemon app.js
pause