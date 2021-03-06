async function imageLoad(urls, fn) {
	function get_url_promise(url) {
		let img = new Image();
		img.src = url;
		return new Promise(function(resolve, reject) {
			img.onload = function() {
				let canvasEle = document.createElement('canvas'),
					ctx = canvasEle.getContext('2d'),
					{ height , width } = img;
				let imageData;
				canvasEle.height = height;
				canvasEle.width = width;
				ctx.drawImage(img, 0, 0);
				imageData = ctx.getImageData(0, 0, width, height);
				ctx.clearRect(0, 0, imageData.width, imageData.height);
				resolve(imageData);
			}
			img.onerror = function(err) {
				reject(err);
			}
		})
	}

	if (typeof urls == 'string') {
		let imagedata = await get_url_promise(urls);
		fn(imagedata);
	} else if (Array.isArray(urls)) {
		let url_promise_array = urls.map((url) => {
			return get_url_promise(url)
		});
		let imagedata_array = await Promise.all(url_promise_array);
		fn(imagedata_array)
	}
}

function error(msg) {
	throw new Error(msg)
}

function imageOutput(imagedata, el) {
	imagedata instanceof ImageData ? imagedata :
		error('imagedata must be an instance of ImageData');
	let canvas = document.createElement('CANVAS'),
		img = new Image(),
		ctx = canvas.getContext('2d');

	[canvas.height, canvas.width] = [imagedata.height, imagedata.width];
	ctx.putImageData(imagedata, 0, 0);
	img.src = canvas.toDataURL("image/png");
	el.add = el.append?el.append:el.appendChild;
	el && el.add(img);
	return img;
}

function isflatArray(array){
	if(Array.isArray(array)){
		if(array.length<=0){
			return true
		}else{
			return !Array.isArray(array[0]);
		}
	}else{
		return false;
	}
}

function createImageData(width,height){
	return document.createElement('CANVAS').getContext('2d').createImageData(width,height)
}

function execTime(fn){
	let timebegin = new Date().getTime();
	let res = fn();
	let timeend = new Date().getTime();
	console.log(timeend - timebegin);
	return res;
}

function createArray(sizex){
	// let array = !sizey?new Array(sizex).fill(0): new Array(sizey).fill(new Array(sizex).fill(0))
	return new Array(sizex).fill(0);
}

function copyArray(arr){
	let newarr = [],
		length = arr.length;
	for(let i =0;i<length;i++){
		if(Array.isArray(arr[i])){
			newarr[i] = copyArray(arr[i])
		}else{
			newarr[i] = arr[i]
		}
	}
	return newarr;
}

function asyncMapThree(arr,fn){//async
	let count = 0,
		length = arr.length-1;

	if(length>4){//four cpu core
		new error("the thread can't be more than 4")
	}
	let arrs = [arr[0],arr[1],arr[2]];
	arrs.forEach((e)=>{
		let w;
		try{
			w = new Worker('worker.js');
		}catch(err){
			error('construct thread error')
			error(err.toString());
			return;
		}
		let data = {
			type:'Worker',
			data:JSON.stringify(e)
		}
		w.postMessage(data);
		let afterComputed = [];
		//type int rgb 012 
		//e = {type:int,data:string}
		w.onmessage = (e)=>{
			count = count+1;
			afterComputed[e.type] =JSON.parse(e.data);
			if(count == length){
				fn(afterComputed)
			}
		}
	})
}

export default {
	imageLoad,
	error,
	imageOutput,
	isflatArray,
	createImageData,
	execTime,
	createArray,
	copyArray,
	asyncMapThree
}