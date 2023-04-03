class Matrix {
	constructor(rows, cols, data = []) {
		// 设置行
		this.rows = rows;
		// 设置列
		this.cols = cols;
		// 判断是否存在矩阵数据，
		if (data.length) {
			// 矩阵数据长度要与行和列匹配
			if (data.length < this.rows * this.cols) {
				// 抛出错误
				throw new Error('矩阵数据长度与行、列不对应');
			}
			// 设置数据
			this.data = data;
		} else {
			// 没有则创建一个长度为rows*cols的全0数组，用于输出数据
			this.data = new Array(rows * cols).fill(0);
		}
	}
	// 获取row行col列的数据 例：1行2列 row：1 col：2
	get(row, col) {
		// 从数组中拿到数据 数组下标从0开始
		return this.data[(row - 1) * this.cols + (col - 1)];
	}
	// 设置row行col列的数据
	set(row, col, value) {
		// 0没有负数 在设置部分处理
		if (Math.abs(value) === 0) {
			value = 0;
		}
		// 设置数组中的数组 数组下班从0开始
		this.data[(row - 1) * this.cols + (col - 1)] = value;
	}
	// 矩阵乘法 数学公式法
	multiply(other) {
		// 矩阵乘法条件 当A列=B行，AB可以相乘
		if (this.cols !== other.rows) {
			throw new Error('第一个矩阵中的列数必须等于第二个矩阵中的行数');
		}
		// 初始化一个全0矩阵 行为A的行 列为B的列
		const result = new Matrix(this.rows, other.cols);
		// 进行遍历行和列，设置新的矩阵值
		for (let i = 1; i <= this.rows; i++) {
			for (let j = 1; j <= other.cols; j++) {
				// 求和
				let sum = 0;
				// C中的第i行j列 为A的第i行的值、B的j列的值 对应相乘再相加
				for (let k = 1; k <= this.cols; k++) {
					sum += this.get(i, k) * other.get(k, j);
				}
				// 矩阵设置i行j列的值
				result.set(i, j, sum);
			}
		}
		// 返回进行变换后的新数组
		return result;
	}
	// 全排列
	fullPermutate(nums) {
		// 输入：[1,2,3]
		// 输出：[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]
		let result = [];
		// 排列
		function permute(pArr, selectedResult) {
			if (selectedResult.length === nums.length) {
				// 已找到一组数组 结束当前递归
				result.push(selectedResult);
			} else {
				// 遍历数组的每一项
				for (let i = 0; i < pArr.length; i += 1) {
					// 对上次已获取结果的拷贝
					let selectedArr = selectedResult.concat();
					// 将这次的结果存入
					selectedArr.push(pArr[i]);
					// 做一个克隆 避免相互影响
					let newArr = pArr.concat();
					// 删掉数组中的当前项
					newArr.splice(i, 1);
					// 递归 将数组继续进行全排序
					permute(newArr, selectedArr);
				}
			}
		}
		// 执行排列
		permute(nums, []);
		// 返回全排列数组
		return result;
	}
	// 逆序数 前面的数字比后面数字大的数对数量
	reverseNumber(nums) {
		// 输入：[3,2,1]
		// 输出：3
		// 默认为0
		let reverseNum = 0;
		// 进行遍历
		for (let i = 1; i < nums.length; i += 1) {
			for (let j = 0; j < i; j += 1) {
				// 前面的数字比后面数字大 逆序数值+1
				if (nums[j] > nums[i]) {
					reverseNum += 1;
				}
			}
		}
		// 返回逆序数
		return reverseNum;
	}
	//矩阵行列式 运用全排序和逆序数
	det() {
		// 先判断是否为方阵 非方针没有行列式
		if (this.rows !== this.cols) {
			throw new Error('矩阵必须是方阵');
		}
		let result = 0;
		// 需要进行全排序的一组数据
		let permuteNums = [];
		// 根据行数来确定需要进行全排序的数组
		for (let i = 1; i <= this.rows; i += 1) {
			permuteNums.push(i);
		}
		// 获取全排列数组
		const fullPermutate = this.fullPermutate(permuteNums);
		// 遍历全排序数组
		for (let k = 0; k < fullPermutate.length; k += 1) {
			// 逆序数 用于确定正负号
			const reverseNumber = this.reverseNumber(fullPermutate[k]);
			// 矩阵的项相乘所得到的值
			let val = 1;
			// 遍历行
			for (let n = 1; n <= this.rows; n += 1) {
				// 例：a11*a22*a33 a12*a22*a23 固定行，列为全排序数组项 矩阵列从1开始，数组数据从0开始
				val = val * this.get(n, fullPermutate[k][n - 1]);
			}
			// 正负号由-1的逆序数次幂来确定
			result += val * Math.pow(-1, reverseNumber);
		}
		// 返回行列式的值
		return result;
	}
	// 转置矩阵 将Aij替换为Aji
	transpose() {
		// 转置矩阵 形式上说 m*n的矩阵A的转置是n*m矩阵
		let result = new Matrix(this.cols, this.rows);
		// 遍历行和列
		for (let i = 1; i <= this.cols; i += 1) {
			for (let j = 1; j <= this.rows; j += 1) {
				// 判断是否存在对应值
				if (this.get(j, i) !== null) {
					// 将Aij 替换为Aij
					result.set(i, j, this.get(j, i));
				}
			}
		}
		// 返回一个转置矩阵
		return result;
	}
	// 余子式 除去Aij所在行和列剩余的矩阵的行列式
	surplus(delRow, delCol) {
		// 新的矩阵的data值
		let newData = [];
		// 遍历行和列
		for (let i = 1; i <= this.rows; i += 1) {
			for (let j = 1; j <= this.cols; j += 1) {
				// i和j不等于需要被删除的行和列，就把数据push进新的data值
				if (j !== delCol && i !== delRow) {
					newData.push(this.get(i, j));
				}
			}
		}
		// 设置surplusMatrix矩阵 行列被删除1
		const surplusMatrix = new Matrix(this.rows - 1, this.cols - 1, newData);
		// 返回余子式
		return surplusMatrix.det();
	}
	// 伴随矩阵 矩阵中每个元素对应的代数余子式所构成矩阵的转置矩阵
	adjoint() {
		// 创建一个0矩阵
		let result = new Matrix(this.rows, this.cols);
		// 遍历行和列
		for (let i = 1; i <= this.rows; i += 1) {
			for (let j = 1; j <= this.cols; j += 1) {
				// val 为Aij 的代数余子式
				let val = Math.pow(-1, i + j) * this.surplus(i, j);
				// 设置矩阵内的每个元素
				result.set(i, j, val);
			}
		}
		// 将矩阵进行转置
		return result.transpose();
	}
	// 矩阵求逆 使用伴随矩阵求逆矩阵 A逆 = 1/｜A｜ * A*
	inverse() {
		// 判断行列式是否为0 充分且必要条件
		if (this.det() === 0) {
			throw new Error('该矩阵的行列式为0，不存在逆矩阵 ');
		}
		// 1/｜A｜
		const detVal = 1 / this.det();
		// 得到伴随矩阵
		let result = this.adjoint();
		// 进行遍历行和列
		for (let i = 1; i <= result.rows; i += 1) {
			for (let j = 1; j <= result.cols; j += 1) {
				// 重新设置矩阵的值 矩阵每项*常数
				result.set(i, j, detVal * result.get(i, j));
			}
		}
		// 返回一个逆矩阵
		return result;
	}
}

class CameraMatrix extends Matrix {
	constructor(data = []) {
		super(4, 4, data);
	}
	// 乘法
	cMultiply(mat1, mat2) {
		const newMat1 = new CameraMatrix(mat1);
		const newMat2 = new CameraMatrix(mat2);
		return newMat1.multiply(newMat2).data;
	}
	// 单位化向量 向量是有方向和大小的 单位化就是保持其方向不变，将其长度化为1， a/|a|, 向量的长度 (x,y) Math.sqrt (x^2 + y^2)
	normalize(vector) {
		let sum = 0;
		let length;
		for (let i = 0; i < vector.length; i += 1) {
			sum += vector[i] * vector[i];
		}
		length = Math.sqrt(sum);
		let newVector = [];
		if (length > 0) {
			for (let i = 0; i < vector.length; i += 1) {
				newVector.push(vector[i] / length);
			}
		}
		return newVector;
	}
	// 向量减法
	subtraction(vector1, vector2) {
		let sum = [];
		let maxLength =
			vector1.length > vector2.length ? vector1.length : vector2.length;
		for (let i = 0; i < maxLength; i += 1) {
			sum.push((vector1[i] ? vector1[i] : 0) - (vector2[i] ? vector2[i] : 0));
		}
		return sum;
	}
	// 叉积 两个三维向量生成一个新的三维向量 还可以用行列式计算 行列式的值为新向量的长度，方向遵循右手法则
	cross(vector1, vector2) {
		return [
			vector1[1] * vector2[2] - vector1[2] * vector2[1],
			vector1[2] * vector2[0] - vector1[0] * vector2[2],
			vector1[0] * vector2[1] - vector1[1] * vector2[0],
		];
	}
	// lookat
	lookAt(cameraPosition, targetPonit, up) {
		// 进行单位化处理
		let zAxis = this.normalize(
			// 确认Z轴的方向
			this.subtraction(cameraPosition, targetPonit)
		);
		// X轴的方向由z轴和模拟的Y轴叉乘得到
		var xAxis = this.normalize(this.cross(up, zAxis));
		// y轴的方向由z轴和X轴叉乘得到
		var yAxis = this.normalize(this.cross(zAxis, xAxis));
		// 以上我们确定了相机的坐标系
		// 接下来需要将世界坐标中的点转换到相机坐标中，平移，旋转，逆运算
		const translateMatrix = new CameraMatrix(
			this.translate(cameraPosition[0], cameraPosition[1], cameraPosition[2])
		);
		const rotateMatrix = new CameraMatrix(this.rotate(xAxis, yAxis, zAxis));
		const newMarix = translateMatrix.multiply(rotateMatrix);
		return newMarix.inverse().data;
	}
	// viewport 从[-1,1]到[x,gl.width]
	viewport(width, height, depth) {
		return [
			width / 2,
			0,
			0,
			width / 2,
			0,
			height / 2,
			0,
			height / 2,
			0,
			0,
			depth / 2,
			depth / 2,
			0,
			0,
			0,
			1,
		];
	}
	// 正交投影矩阵 平移到原点+缩放
	orthographic(left, right, bottom, top, near, far) {
		return [
			2 / (right - left),
			0,
			0,
			(left + right) / (left - right),

			0,
			2 / (top - bottom),
			0,
			(bottom + top) / (bottom - top),

			0,
			0,
			2 / (near - far),
			(near + far) / (near - far),

			0,
			0,
			0,
			1,
		];
	}
	// 透视投影矩阵 观察点的视场角，镜面宽高比
	perspective(nFov, nAspectRatio, nNear, nFar) {
		let q = 1 / Math.tan(((nFov / 180) * Math.PI) / 2);
		let a = q / nAspectRatio;
		let b = (nNear + nFar) / (nNear - nFar);
		let c = (2 * (nNear * nFar)) / (nNear - nFar);
		return [a, 0, 0, 0, 0, q, 0, 0, 0, 0, b, c, 0, 0, -1, 0];
	}
	// 平移矩阵
	translate(x, y, z) {
		return [1, 0, 0, x, 0, 1, 0, y, 0, 0, 1, z, 0, 0, 0, 1];
	}
	// 绕固定坐标系的旋转矩阵
	rotate(i, j, k) {
		return [
			i[0],
			j[0],
			k[0],
			0,
			i[1],
			j[1],
			k[1],
			0,
			i[2],
			j[2],
			k[2],
			0,
			0,
			0,
			0,
			1,
		];
	}
	// 基本旋转矩阵
	xRotate(angle) {
		// 角度转化为弧度
		angle = Math.PI * angle / 180;
		var c = Math.cos(angle);
		var s = Math.sin(angle);
		return [1, 0, 0, 0, 0, c, -s, 0, 0, s, c, 0, 0, 0, 0, 1];
	}
	yRotate(angle) {
		angle = Math.PI * angle / 180;
		var c = Math.cos(angle);
		var s = Math.sin(angle);
		return [c, 0, s, 0, 0, 1, 0, 0, -s, 0, c, 0, 0, 0, 0, 1];
	}
	zRotate(angle) {
		angle = Math.PI * angle / 180;
		var c = Math.cos(angle);
		var s = Math.sin(angle);
		return [c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
	}
	// 生成4*4单位矩阵
	identity() {
		return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
	}
	// 缩放矩阵
	scale(sx, sy, sz) {
		return [sx, 0, 0, 0, 0, sy, 0, 0, 0, 0, sz, 0, 0, 0, 0, 1];
	}
}

// 测试
// const A = new Matrix(2, 3, [1, 2, 3, 4, 5, 6]);
// const B = new Matrix(3, 2, [7, 8, 9, 10, 11, 12]);
// const C = A.multiply(B);
// console.log(C.data); //输出：[58, 64, 139, 154]

const D = new CameraMatrix([1, 0, 0, 0, 0, 3, 0, 0, 0, 0, 4, 0, 0, 0, 0, 2]);
const E = D.inverse();
const F = D.multiply(E);
console.log(E.data); //输出：[1, 0, 0, 0, 0, 0.3333333333333333, 0, 0, 0, 0, 0.25, 0, 0, 0, 0, 0.5]
console.log(F.data); //输出：[1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]

const U1 = D.normalize([1, 2, 3]);
console.log(U1);

const U2 = D.subtraction([1, 2], [3, 4]);
console.log(U2);

const lookAt = D.lookAt([0, 0, 2], [0, 0, 0], [0, 1, 0]);
console.log(lookAt);

// const G = new Matrix(3, 3, [1, -4, -3, 1, -5, -3, -1, 6, 4]);
// const H = G.inverse();
// const I = G.multiply(H);
// console.log(H.data); //输出：[2, 2, 3, 1, -1, 0, -1, 2, 1]
// console.log(I.data); //输出：[1, 0, 0, 0, 1, 0, 0, 0, 1]
