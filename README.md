# Instant-Discord-Roblox-Link-Joiner

**HOW TO INSTALL:**
1. [Install Vencord (if you haven't already, click here)](https://vencord.dev/)
 
2. [Install Node.js (Required)](https://nodejs.org/en)
   * After installing Node.js, open Terminal and run:
   
    npm install -g pnpm
   
3. [Install Git (Required)](https://git-scm.com/downloads)

4. **Clone Vencord:**
   Open the Terminal and type the following commands in order:
   * cd %USERPROFILE%\Desktop
   * git clone https://github.com/Vendicated/Vencord
   
   **THEN:**
   Open the Vencord Folder created on your desktop, Open the src folder, and create a new folder. Call it "userplugins". If you already have this folder you do not need to do it.
   Inside of the userplugins folder, place the InstantRobloxJoin folder that you downloaded from this page.
   
   Go back to your terminal and type:
   * cd Vencord
       (if you closed the command prompt, just type cd %USERPROFILE%\Desktop\Vencord)
   * pnpm install
   * pnpm build
   * pnpm inject
   This will Close your discord. Re Open discord and go to your plugins settings and search Instant Roblox Join and enable it. Thats all!
