# hrcu bel instructions

| Pre-Requisites |
| -------------- |
| Node 14.x.x +  |
| .env           | 

:warning: You will need to get the .env from the creator/org and configure the I/O variables to your preferences

1. Git clone or download the repository into the desired location
2. To check if node windows is globally available through npm
```js
npm list -g node-windows

//if not installed globally run the following

npm i -g node-windows
```
3. run command to install all relevant packages in the project directory
```js
npm install
```
4. Link node-windows to project directory
```js
npm link node-windows
```
 
5. Run node-windows install script through npm
```js
npm run install

// if you wish to uninstall

npm run uninstall
```

:book: The Service should automatically start and re-start on rebooting of the machine