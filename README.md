# OP Biome Plugins

**What are they**
1. Instant Roblox Join basically skips the entire process of opening the roblox browser and loading everything. It will directly open the roblox private server link. If you already have roblox open and click a link, it will take a bit to close roblox and then open it, but its still overall faster. Don't Spam click the link if you think it doesn't work.

2. Rare Biome Notifier will send a notification on Discord (similar to how Relationship plugin works, so it won't send a notification from Windows) when a Rare Biome starts. You have to manually put the Server ID's and Channel ID's. You don't need to touch anything else. Clicking the notification will directly take you to the channel. This is very useful to those who have Windows Notifications muted and its honenstly faster than just clicking the windows notification. I recommend putting channel IDs of Forward Channels as it would be very inefficient to put a channel ID of every single macro channel.

**INSTALLATION GUIDE**
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
   Inside of the userplugins folder, Extract the .zip's that you installed from here and after that delete the .zip's.
   
   Go back to your terminal and type:
   * cd Vencord
       (if you closed the command prompt, just type cd %USERPROFILE%\Desktop\Vencord)
   * pnpm install (if you never installed)
   * pnpm build
   * pnpm inject
   This will Close your discord. Re Open discord and go to your plugins settings, search the name of the plugin you installed, Enable them and configure them if you want. Thats all.
