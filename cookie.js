
if (navigator.cookieEnabled === false){
	alert("Cookies отключены!");
}
if (document.cookie.length == 0)
{
    document.cookie = "isAuth=false";
    document.cookie = "GUID=" + GUID;
}

//var results = document.cookie.match(/isAuth=(.+?)(;|$)/);
//if(results[1] == true)
//{
//    isAuth = true;
//    GUID = document.cookie.match(/GUID=(.+?)(;|$)/);
//}

function setCoockie(Name, Value)
{
    document.cookie = Name + "=" + Value;
}

function learnGuidFromCookie() {
    return 
}