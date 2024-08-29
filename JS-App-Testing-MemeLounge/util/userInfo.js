function getUserObj(){
    return JSON.parse(sessionStorage.getItem('meme-user'));
}

function getToken(){
    if(getUserObj()){
        return getUserObj().accessToken;
    }
    return null;
}

export const userInfo = {
    getUserObj,
    getToken
}