#pragma strict


var SpeedReturn : int ;    // multiplicator speed for the time shifting
var AvailableTime : float ;              // time disered to return in maximum
var KeyUseForReturn : String;		// determine the key used to launch time shifting
var UseTag : boolean ;                  // if true , use tag for make itemlist for time shifting
var TagUsed : String ;  			// determine the tag  used for make itemlist
var ItemList : GameObject[];     // list of gameobject affected by timeshifting
var ObjectNumbers : int ;      // number of  gameobject in the list
 
 
static var TimeUsable : float = 0;
static var TimeUsed : float = 0;


static var Life : int = 100;       // static var with life stored
static var Bonus : int = 0;       // static var with bonus stored
static var Score : int = 0;       // static var with score stored
private var time : float = 0;         //  actual value use
private var NbData : int;		// number of value can be stored
private var DataDispo : int ;    // number of value availlable for time shifting
private var DataRecup : int ;   // number of value use for time shifting
private var IsReturnInTime : boolean ;      // time shifting actualy activate ?
private var ObjectPosVel : Vector3[,,];         // arrays with position and rigidbody velocity
private var ObjectRotation : Quaternion[,];     // arrays with rotation
private var ObjectKinematicActive : boolean[,,]; // arrays with boolean if kinematic and if active
private var LifeBonusScore: int[,];     //arrays with life / bonus / score 



InvokeRepeating("TimeShifting", 0.05, 0.025 );  // start save at the begin of the scene, execute 40 time / seconde.




function Start () {
	time=0;
	NbData = (AvailableTime*40) ;
	
	if (UseTag){
		ItemList = GameObject.FindGameObjectsWithTag (TagUsed);
	}
	
	ObjectNumbers = ItemList.Length;

	
	ObjectPosVel = new Vector3[ObjectNumbers,NbData,2];
	ObjectRotation = new Quaternion[ObjectNumbers,NbData];
	ObjectKinematicActive = new boolean[ObjectNumbers,NbData,2];
	LifeBonusScore = new int[NbData,3];
	
	
	DataDispo = 0 ;
	DataRecup = 0 ;
	Life = 100 ;
	Bonus = 0 ;
	Score = 0 ;
}

 



function Update () {
	    if (Input.GetKeyDown (KeyUseForReturn)) {
	            GoReturns();
	    }
	    

	    
	    if (Input.GetKeyUp (KeyUseForReturn) ) {
				StopReturns();     
	    }    
	TimeUsable= Mathf.Round((0.025*(DataDispo-DataRecup)) * 10f) / 10f;
	TimeUsed= Mathf.Round(((0.025*DataRecup)) * 10f) / 10f;
}



function TimeShifting() {
	if(!IsReturnInTime){ 
		SaveState();
	}
	else if (IsReturnInTime){
		for (var x : int = 0; x < SpeedReturn; x++){
			ApplyState();
		}
    }

}



/////////////////////////////////////// SAVE DATA /////////////
function SaveState(){
	DataDispo++;
	if (DataDispo >=NbData){
	DataDispo=NbData;
	}
	if (time <NbData-1){
		time++;
	}
	else{ 
		time=0;
	}	
	for (var x : int = 0; x < ObjectNumbers; x++){
		ObjectPosVel[x,time,0]=ItemList[x].transform.position;
		ObjectRotation[x,time]=ItemList[x].transform.rotation;
		ObjectKinematicActive[x,time,1] =ItemList[x].activeSelf;
		if (ItemList[x].rigidbody){
			ObjectPosVel[x,time,1]=ItemList[x].rigidbody.velocity;
			ObjectKinematicActive[x,time,0] = ItemList[x].rigidbody.isKinematic;
		}
		else{
			ObjectPosVel[x,time,1]=Vector3(0,0,0);
			ObjectKinematicActive[x,time,0] = true;
		}
	}
		LifeBonusScore[time,0] = Life ;
		LifeBonusScore[time,1] = Bonus;
		LifeBonusScore[time,2] = Score;
}

   
    


/////////////////////////////////////// INIT TIME SHIFTING /////////////
function GoReturns(){ 
	if ((DataDispo-DataRecup)!=1){
			DataRecup =0;
			IsReturnInTime = true ;
			for (var x : int = 0; x < ObjectNumbers; x++){
				if (ItemList[x].GetComponent(CharacterController)){
					ItemList[x].GetComponent(CharacterController).enabled = false ;
				}	
				if (ItemList[x].rigidbody){
					ItemList[x].rigidbody.isKinematic =true;
				}
				
			}
	}		
}



/////////////////////////////////////// APPLY DATA /////////////
function ApplyState(){
	if ( DataRecup < DataDispo-1 ){
	DataRecup++;
		if (time >0){
			time--;
		}
		else {
			time=NbData-1;
		}
		for (var x : int = 0; x < ObjectNumbers; x++){
			ItemList[x].transform.position=ObjectPosVel[x,time,0];
			ItemList[x].transform.rotation=ObjectRotation[x,time];
			ItemList[x].SetActive(ObjectKinematicActive[x,time,1]);
		}
		Life = LifeBonusScore[time,0];
		Bonus = LifeBonusScore[time,1];
		Score = LifeBonusScore[time,2];
	}
}



/////////////////////////////////////// CLOSE TIME SHIFTING /////////////
function StopReturns(){
	DataDispo =DataDispo-DataRecup;
	DataRecup =0;
	IsReturnInTime = false ;
	for (var x : int = 0; x < ObjectNumbers; x++){
		if (ItemList[x].GetComponent(CharacterController)){
			ItemList[x].GetComponent(CharacterController).enabled = true ;
		}		
		if (ItemList[x].rigidbody){
			ItemList[x].rigidbody.isKinematic = ObjectKinematicActive[x,time,0];
			if(!ObjectKinematicActive[x,time,0]){
				ItemList[x].rigidbody.velocity=ObjectPosVel[x,time,1];
			}
		}
	}
}





