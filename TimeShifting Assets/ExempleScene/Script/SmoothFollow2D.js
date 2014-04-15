
#pragma strict

var target : Transform;
var smoothTime = 0.3;
private var thisTransform : Transform;
private var velocity : Vector3;

function Start()
{
	thisTransform = transform;
}

function Update() 
{
	thisTransform.position.x = Mathf.SmoothDamp( thisTransform.position.x, 
		target.position.x-5, velocity.x, smoothTime);//-4
	//thisTransform.position.y = Mathf.SmoothDamp( thisTransform.position.y, 
	//	target.position.y + 5,velocity.y, smoothTime);//+3.4
}