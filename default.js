		// let Compute =  require('./imagecompute/main.js');
		// loadPrePic(['./amazingball.png'])
		// function loadPrePic(picArray){
		// 	let count  = picArray.length;
		// 	let picarray = [];
		// 	picArray.forEach(function(e){
		// 		let canvasEle = document.createElement(`CANVAS`);
		// 		let ctx = canvasEle.getContext('2d');
				
		// 		let img = new Image();
		// 		img.src = e;
		// 		img.onload = function(){
		// 			let {
		// 				height,
		// 				width
		// 			} = img;
		// 			canvasEle.height = height;
		// 			canvasEle.width = width;
		// 			count-=1;
		// 			ctx.drawImage(img, 0, 0);
		// 			let imageData = ctx.getImageData(0, 0, width, height);
		// 			ctx.clearRect(0,0,imageData.width,imageData.height);
		// 			picarray.push(imageData);//不保证图片的顺序
		// 			if(count == 0){
		// 				init('./2.jpg',picarray);//前置图片加载完毕之后初始化
		// 			}
		// 		}
		// 	});
		// }
		// function init(pic,prepic) {
		// 	let State = {
		// 		canvasEle: Object,
		// 		ctx: Object,
		// 		imageData: Object,
		// 		prepic:Array
		// 	};
		// 	let gen;

		// 	function load(img, el) {
		// 		let {
		// 			height,
		// 			width
		// 		} = img;
		// 		let canvasEle = document.createElement(`CANVAS`);
		// 		let ctx = canvasEle.getContext('2d');

		// 		canvasEle.height = height;
		// 		canvasEle.width = width;
		// 		ctx.drawImage(img, 0, 0);
		// 		el.appendChild(canvasEle);

		// 		let imageData = ctx.getImageData(0, 0, width, height);
		// 		State = {
		// 			canvasEle,
		// 			ctx,
		// 			imageData,
		// 			prepic
		// 		};
		// 		console.log(prepic)
		// 		gen.next();
		// 	}

		// 	function* initCanvas(pic,
		// 		el = document.getElementsByTagName('BODY')[0]) {
		// 		let img = new Image();
		// 		img.src = pic;
		// 		yield img.onload = function() {
		// 			load(img, el)
		// 		};
		// 		//全局的状态 canvas元素，绘图上下文，图像数据
		// 		//进行图片的处理
		// 		let imagedata = Compute.deal(State);
		// 		//clear
		// 		State.ctx.clearRect(0,0,State.imageData.width,State.imageData.height);
		// 		//调整大小
		// 		State.canvasEle.height = imagedata.height;
		// 		State.canvasEle.width = imagedata.width;
		// 		State.ctx.putImageData(imagedata,0,0,0,0,imagedata.width,imagedata.height);
		// 		return;
		// 	}

		// 	gen = initCanvas(pic);
		// 	gen.next();
		// }
	
	// document.getElementsByTagName('BODY')[0].appendChild(imgele);
	// console.log(img);
	function _getImageData(url){
			var handles = load_img(url);
			handles.next();
			function* load_img(src){
				let img = new Image();
				img.src = src;
				img.onload = function(){
					let canvasEle = document.createElement('CANVAS');
					let ctx = canvasEle.getContext('2d');
					let imageData;
					let {height,width} = img;
					canvasEle.height = height;
					canvasEle.width = width;
					ctx.drawImage(img, 0, 0);
					imageData= ctx.getImageData(0, 0, width, height);
					ctx.clearRect(0,0,imageData.width,imageData.height);
					console.log('over')
					handles.next();
					return imageData
				}
				console.log(img);
				let a = yield 1;
				console.log('返回')
			}
		}
		 // _getImageData('./amazingball.png');

		 //todo need babel
		 // async function imageLoad(url){
		 // 	let img = new Image();
		 // 	img.src = url;
		 // 	await img.onload = function(){
		 // 		console.log('await')
		 // 	}
		 // }

		 //promise

		 new Promise(function(resolve,reject){
		 	let img = new Image();
		 	img.src = './amazingball.png';
		 	img.onload = function(){
		 		console.log('success');
		 		resolve(1)
		 	}
		 }).then(function(val){
		 	console.log(2)
		 })