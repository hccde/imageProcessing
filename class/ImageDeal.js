import utils from '../lib/utils'
import Compute from './Compute'
class ImageDeal{

	constructor(img){
		img instanceof ImageData? (this._imageData = img):
			utils.error('image must be a instance of ImageData');
		this._height = this._imageData.height;
		this._width = this._imageData.width;
		this._oldimageData = this.imageData //keep initally imageData;
		this._Matrix = [];
		this._grayMatrix = [];
		this.factor = Math.max(Math.floor(this._width / 500),Math.floor(this._height)/500);
	};

	get grayMatrix(){
		if(!this._grayMatrix || this._grayMatrix.length <= 0){
			this.toGrayAbstract();
		}
		return this._grayMatrix;
	};

	set grayMatrix(val){
		return val
	};

	set Matrix(val){
		this._Matrix = val;
	}

	get Matrix(){
		if(!this._Matrix || this._Matrix.length <= 0){
			this.toGrayAbstract();
		}
		return this._Matrix;
	}
	/**
	 * simple zip
	 * @param  {int} [scale]
	 * @return {[type]}
	 */
	scale(fn,factor=1){
		let [width,height] = [this._imageData.width,this._imageData.height],
			data = this._imageData.data,
			samllerwidth = Math.floor(width/factor),
			samllerheight = Math.floor(height/factor),
			tem = [];

		let imagedata = new ImageData(samllerwidth,samllerheight),
			smalldata = imagedata.data;
		for(let i = 0,t=0;i<height;i=i+factor){
			for(let j = 0;j<width;j=j+factor,t=t+4){
				tem = fn(data[i*4*width+j*4],data[i*4*width+j*4+1],data[i*4*width+j*4+2],data[i*4*width+j*4+3])
				smalldata[t] = tem[0];
				smalldata[t+1] = tem[1];
				smalldata[t+2] = tem[2];
				smalldata[t+3] = tem[3];
			}
		}
		return imagedata;
	};
	/**
	 * @param  {Element} [dom element wait be appended a child]
	 * @param  {ImageData} [image's imagedata]
	 * @return {[Element]} [image element]
	 */
	out(el,imagedata){
		//async Matrix,grayMatrix and imageData
		if(!imagedata){
			this.asyncData()
			imagedata = this._imageData;
		}
		console.log(imagedata)
		return utils.imageOutput(imagedata,el);
	};
	/**
	 *forced graySaclas and imageData to update ,should avoid this
	 * @return {void}
	 */
	asyncData(){
		this.imageData = ImageDeal.MatrixtoImageData(this.Matrix);
		this._grayMatrix = undefined;
		this.toGrayAbstract();
	}
	/**
	 * turn grayScala Matrix into imagedata
	 * @param  {Array}
	 * @return {ImageData}
	 */
	static grayMatrixtoImageData(grayMatrix){
		let [height,width] = [grayMatrix[0].length,grayMatrix[0][0].length],
			imagedata = new ImageData(width,height),
			data = imagedata.data,
			length = width*height*4,
			apha = grayMatrix[1];
		let offset,value;
		for(let i = 0; i<height; i++){
				offset = i*width*4;
				for(let j = 0; j<width;j++){
					value = grayMatrix[0][i][j];
					data[offset] = value;
					data[offset+1] = value;
					data[offset+2] = value;
					data[offset+3] = apha[i][j];
					offset+=4;

				}
		}
		return imagedata;
	};

	static MatrixtoImageData(Matrix){
		let [r,g,b,a] = [Matrix[0] ,Matrix[1],Matrix[2],Matrix[3]];
		let [height,width] = [r.length,r[0].length];
		let imagedata = new ImageData(width,height),
			data = imagedata.data,
			offset = 0;
		for(let i = 0; i<height; i++){
				offset = i*width*4;
				for(let j = 0; j<width;j++){
					data[offset] = r[i][j];
					data[offset+1] =g[i][j];
					data[offset+2] = b[i][j];
					data[offset+3] = a[i][j];
					offset += 4;
				}
		}
		return imagedata;
	}

	/**
	 * turn imagedata into array
	 * @return {Array} [turn imageData into RGB 2DArray]
	 */
	toAbstract(){
		if(!this._Matrix || this._Matrix.length <= 0){
			let r = [],g=[],b=[],a=[];
			let [width,height,data] = [this._imageData.width,this._imageData.height,this._imageData.data];
			let offset = 0;
			for(let i = 0;i<height;i++){
				r[i] = [];
				b[i] = [];
				g[i] = [];
				a[i] = [];
				offset = i*width*4;
				for(let j = 0;j<width;j++){
					let gray = ( data[offset] * 30 +  data[offset+1] * 59+  data[offset+2] * 11) / 100;
					r[i][j] = data[offset];
					g[i][j] = data[offset+1];
					b[i][j] =data[offset+2];
					a[i][j] = data[offset+3];
					offset += 4;
				}
			}
			this._Matrix = [r,g,b,a];
		}
		return this;
	};

	/**
	 * @return {Array} [turn imageData into gray 2DArray]
	 */
	toGrayAbstract(){
		if(!this._grayMatrix || this._grayMatrix.length <= 0){
			let [width,height,data,grayimageMatrix,apha] = [this._imageData.width,this._imageData.height,
			this._imageData.data,[],[]];
			let offset  = 0;

			for(let i = 0;i<height;i++){
				grayimageMatrix[i] = [];
				apha[i] = [];
				offset = i*width*4;
				for(let j = 0;j<width;j++){
					let gray = ( data[offset] * 30 +  data[offset+1] * 59+  data[offset+2] * 11) / 100;
					// gray = parseInt(gray);
					apha[i][j] = data[offset+3];
					grayimageMatrix[i][j] = gray;
					offset+=4;
				}
			}
			this._grayMatrix = [grayimageMatrix,apha]
		}
		return this;
	};

	gray(){
		this._imageData = this.scale((r,g,b,a)=>{
				let gray = parseInt((r*30+g*59+b*11)/100);
				return[gray,gray,gray,a]
		},this.factor)
		return this._imageData
	};

	reversal(){
		this._imageData = this.scale((r,g,b,a)=>{
			return[255-r,255-g,255-b,a];
		},this.factor)
		return this._imageData;
	};
	/**
	 * @params {Array} [The param of power Transform]
	 * @param {Object} [parm] [{factor:double,degree:double,offset:double}]
	 * @return {Array}
	 */
	power(param){
		this._imageData = this.scale((r,g,b,a)=>{
			r = parseInt(param.degree*Math.pow(r/255,param.factor)*255+param.offset)
				r = r>255?255:r;
			g = parseInt(param.degree*Math.pow(g/255,param.factor)*255+param.offset)
				g = g>255?255:g;
			b = parseInt(param.degree*Math.pow(b/255,param.factor)*255+param.offset)
				b = b>255?255:b;
			// a = parseInt(param.degree*Math.pow(a/255,param.factor)*255+param.offset)
			// 	a = a>255?255:a;
			return[r,g,b,a];
		},this.factor)

		return this._imageData;
	};
}
export default ImageDeal;