


static var mouvement :int;
var speed : float = 6.0;
var jumpSpeed : float = 8.0;
var gravity : float = 20.0;
static var rotate :int =1 ;

private var moveDirection : Vector3 = Vector3.zero;
private var vSpeed : float = 0; 
static var controller: CharacterController; 
private var isdying = 0;
private var saut2 =0;
private var sautready :float ;
    
    function Start () {

    }


function Update() {

    if (!controller) controller = GetComponent(CharacterController);
    

		
    moveDirection = transform.right * Input.GetAxis("Horizontal") * speed *rotate;

    
       
         if (controller.isGrounded) {
       		 vSpeed = 0;
				
		if (Input.GetAxis("Vertical")>0){
		 	vSpeed = jumpSpeed; 
		
        	}
		}


       
     

    vSpeed -= gravity * Time.deltaTime;
    moveDirection.y = vSpeed;
    if ( gameObject.GetComponent(CharacterController).enabled)
    controller.Move(moveDirection * Time.deltaTime);
    
    
    
//    	    if (Input.GetKeyDown ("h")) {
//	            TimeShiftingScript.GoReturns();
//	    }
//	    
//
//	    
//	    if (Input.GetKeyUp ("h") ) {
//				TimeShiftingScript.StopReturns();     
//	    }    

}




var pushPower = 2.0;
var weight = 6.0;
 
function OnControllerColliderHit (hit : ControllerColliderHit){
if(hit.gameObject.name =="mouvant"){
hit.collider.attachedRigidbody.isKinematic= false;
}
    var body : Rigidbody = hit.collider.attachedRigidbody;
    var force : Vector3;
 

    if (body == null || body.isKinematic) { return; }

    if (hit.moveDirection.y < -0.3) {
       force = Vector3 (0, -0.5, 0) * 10 * weight;
    } else {
        force = hit.controller.velocity * pushPower;
    }

    body.AddForceAtPosition(force, hit.point);
}


function OnTriggerStay (other : Collider) {
	if ( other.gameObject.name =="Obstacle"){
		TimeShiftingScript.Life-=1;
	}
	if ( other.gameObject.name =="Bonus"){
		 other.gameObject.SetActive(false);
		TimeShiftingScript.Score+=10;
	}
}



function OnGUI () {

	if (GUI.Button(Rect(10,10,150,30),"recharger scene")){
		Application.LoadLevel(0);
	}

	GUI.Label (Rect (10, 50, 100, 20),"Life ="+ TimeShiftingScript.Life.ToString());
	GUI.Label (Rect (10, 70, 100, 20),"Score ="+ TimeShiftingScript.Score.ToString());
	GUI.Label (Rect (170, 10, 150, 20),"Time Usable ="+TimeShiftingScript.TimeUsable.ToString());
	GUI.Label (Rect (170, 30, 150, 20),"Time Used ="+ TimeShiftingScript.TimeUsed.ToString());
}