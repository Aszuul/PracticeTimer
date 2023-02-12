import * as Timer from "./timer"
import * as User from "./models/user"

var def: Timer.timer = new Timer.timer(30);
var user: User.user = new User.user("default")
var id: NodeJS.Timeout;
var running: boolean = false;
console.log(def.display());

export function start(dur: number) : void{
    if(running){
        clearInterval(id);
        running = false
    }
    var timer: Timer.timer = new Timer.timer(dur);
    document.getElementById("piece")!.innerHTML = timer.getSkillPiece();
    var currentTime = timer.skillsTime;
    console.log(timer);
    id = setInterval(countdown, 1000);
    running = true;
    function countdown() {
        if(timer.duration > 0){
            if(timer.target == false){
                if(currentTime <= 0){
                    if(timer.skillsCount > 1){
                        timer.skillsCount--;
                        currentTime = timer.skillsTime;
                        document.getElementById("piece")!.innerHTML = timer.getSkillPiece();
                    }
                    else{
                        timer.target = true;
                        document.getElementById("piece")!.innerHTML = timer.getTargetPiece();
                    };
                };
                currentTime--;
            };
            timer.duration--;
        }
        else{
            clearInterval(id);
        };
        document.getElementById("timeData")!.innerHTML = timer.display();
    };
};

export function setUser(username: string): void{
    var user = new User.user(username);
    document.cookie = "username=" + username;
    document.getElementById("currentuser")!.innerHTML = user.username;
};

export async function deleteUser(username: string): Promise<void>{
    User.deleteUser(username);
    document.cookie = '';
    document.getElementById("currentuser")!.innerHTML = 'default';
};

function getCookie(cname: string): string {
    var res: string = '';
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        res =  c.substring(name.length, c.length);
      }
      else{
        console.error("Unable to find cookie");
      }
    }
    return res
  }

async function checkCookie(): Promise<void> {
    var username: string
    try{
        username = getCookie("username");
    } catch(err){
        username = prompt("Please enter your name:", "") as string;
        if (username != "" && username != null) {
            document.cookie = "username=" + username;
        }
    }
    user = new User.user(username);
    alert("Welcome " + user.username);
    document.getElementById("username")!.setAttribute('value', user.username);
};

window.onload = function(){
    checkCookie();
    document.getElementById("timeData")!.innerHTML = def.display();
    document.getElementById("piece")!.innerHTML = def.getSkillPiece();
};
