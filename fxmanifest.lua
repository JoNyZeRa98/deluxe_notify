--[[
		     ______________________________________
________|            Deluxe Notify             |_______
\       |      deluxedevelopment.tebex.io      |      /
 \      |                                      |     /
 /      |______________________________________|     \
/__________)                                (_________\                                                                           

  Discord Support: https://discord.gg/pFUT9TYNUZ

  This is a free advanced notifications system made by DeluxeDevelopment. 
  The script is completely standalone and compatible with any framework.
]]

fx_version 'cerulean'
game 'gta5'
lua54 'yes'

name 'Deluxe Notify'
author 'Deluxe Development'
version '1.0.0'
changelog 'Released script date: 06/02/2024'

support 'https://discord.gg/pFUT9TYNUZ'
shop 'https://deluxedevelopment.tebex.io'

description 'Deluxe Development | Free Notification System'

server_scripts {'server/main.lua'}
client_scripts {'client/main.lua'}

files {
    'config.json',
    'web/index.html',
    'web/assets/css/style.css',
    'web/assets/js/main.js',
    'web/assets/img/*.png',
}

ui_page 'web/index.html'