function setThemeFromCookie() {
    const themeState = document.getElementById('changemode');
    themeState.className = isThemeSelected() ? 'dark-mode' : 'light-mode';
   }
   function setThemeSwitchState() {
    document.getElementById('toggleTheme').checked = isThemeSelected();
   }
   function isThemeSelected() {
    return document.cookie.match(/theme=dark/i) != null;
   }
   function toggleTheme() {
    const themeState = document.getElementById('changemode');
    const currentState = themeState.className;
    const newState = themeState.className == 'dark-mode' ? 'light-mode' : 'dark-mode';
    themeState.className = newState;
    document.cookie = 'theme=' + (newState == 'light-mode' ? 'light' : 'dark');
   }
   (function() {
    setThemeFromCookie();
    setThemeSwitchState();
    document.getElementById('toggleTheme').onchange=toggleTheme;
   })();