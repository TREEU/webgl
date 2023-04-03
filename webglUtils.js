function initShaders(gl, vshader, fshader) {
	var program = createProgram(gl, vshader, fshader);
	if (!program) {
		console.log('Failed to create program');
		return false;
	}
	gl.useProgram(program);
	gl.program = program;

	return true;
}

// 创建着色器对
function createProgram(gl, vshader, fshader) {
	var vertexShader = createShader(gl, gl.VERTEX_SHADER, vshader);
	var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fshader);
	if (!vertexShader || !fragmentShader) {
		return null;
	}

	var program = gl.createProgram();
	if (!program) {
		return null;
	}

	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);

	gl.linkProgram(program);

	var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
	if (!linked) {
		var error = gl.getProgramInfoLog(program);
		console.log('Failed to link program: ' + error);
		gl.deleteProgram(program);
		gl.deleteShader(fragmentShader);
		gl.deleteShader(vertexShader);
		return null;
	}
	return program;
}

// 创建着色器
function createShader(gl, type, source) {
	var shader = gl.createShader(type);
	if (shader == null) {
		console.log('unable to create shader');
		return null;
	}

	gl.shaderSource(shader, source);

	gl.compileShader(shader);

	var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
	if (!success) {
		var error = gl.getShaderInfoLog(shader);
		console.log('Failed to compile shader: ' + error);
		gl.deleteShader(shader);
		return null;
	}

	return shader;
}


function reSize() {
	canvas.height = window.innerHeight;
	canvas.width = window.innerWidth;
	canvas.style.width = canvas.width + 'px';
	canvas.style.height = canvas.height + 'px';
}