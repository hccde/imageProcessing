import Compute from './Compute';
import ImageDeal from './ImageDeal';

class AbstructCompute{
	constructor(matrix){
		this.Matrix = matrix
	}
	/**
	 * [Gaussian blur]
	 * @param {Array}  mask [mask tmpl]
	 */
	CarlFilter(mask = [
					[2,4,5,4,2],
					[4,9,12,9,4],
  					[5,12,15,12,5],
  					[4,9,12,9,4],
  					[2,4,5,4,2]] ){
		let arr = [this.Matrix[0],this.Matrix[1],this.Matrix[2]].map((matrix)=>{
			let compute = new Compute(matrix)
			return compute.moveTmpl(mask,function(tmpl,imagearea){
						let row = tmpl.length;
						let col = tmpl[0].length;
						let sum=0;
						let div = 0;
						for(let i =0;i<tmpl.length;i++){
							for(let j = 0;j<tmpl[0].length;j++){
								div+=tmpl[i][j];
							}
						}
						for(let i = 0;i<row;i++){
							for(let j = 0;j<col;j++){
								sum += tmpl[i][j]*imagearea[i][j];
							}
						}
						return parseInt(sum/div);
					})
		})
		arr.push(this.Matrix[3]);
		return ImageDeal.MatrixtoImageData(arr);
	}

	
}

export default AbstructCompute;