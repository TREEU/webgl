

//顶点着色器
const vertexShaderSource = `
    attribute vec4 a_Position;
    attribute vec4 a_color;
    uniform mat4 u_MvpMatrix;
    varying vec4 v_color;
    void main(){
       gl_Position = u_MvpMatrix * a_Position;
       v_color = a_color;
    }`;

//片元着色器
const fragmentShaderSource = `
    precision mediump float;
    varying vec4 v_color;
    void main(){
       gl_FragColor = v_color;
    }`;

function main() {
    const canvas = document.getElementById('canvas');
    reSize();

    window.onresize = function () {
        reSize();
    };

    let gl = canvas.getContext('webgl');

    //初始化着色器
    initShaders(gl, vertexShaderSource, fragmentShaderSource);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    const u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');

    //获取需要绘制图形的次数
    const n = initVertexBuffers(gl);

    //定义一个保存现在角度的数组[x,y,z]
    let currentAngle = [30, 30, 20.0];
    //添加交互的方法
    initEventHandlers(canvas, currentAngle);

    //设置一个定时绘制的函数
    const tick = function () {
        draw(gl, n, u_MvpMatrix, currentAngle);
        requestAnimationFrame(tick);
    };
    tick();
}

function initEventHandlers(canvas, currentAngle) {
    //添加拖拽事件
    canvas.onmousedown = function (e) {
        const downX = e.clientX;
        const downY = e.clientY;

        // 控制速度
        const factorX = 0.2;
        const factorY = 0.2;

        const beforeAngle = [];
        beforeAngle[0] = currentAngle[0];
        beforeAngle[1] = currentAngle[1];
        beforeAngle[2] = currentAngle[2];

        document.onmousemove = function (e) {
            const moveX = e.clientX;
            const moveY = e.clientY;

            const x = factorX * (moveX - downX);
            const y = factorY * (moveY - downY);
            // 不设置最大范围
            // currentAngle[0] = Math.max(Math.min(beforeAngle[0] + y, 90.0), -90.0);
            currentAngle[0] = beforeAngle[0] + y;
            currentAngle[1] = beforeAngle[1] + x;
        };

        document.onmouseup = function () {
            document.onmousemove = null;
            document.onmouseup = null;
        };
    };

    function wheel(e) {
        // 控制相机距离
        if (e.wheelDelta) {
            Math.max(
                Math.min((currentAngle[2] += -e.wheelDelta / 120 / 5), 20.0),
                1.0
            )
        }
        e.preventDefault();
    }

    //添加鼠标滚轮事件
    canvas.addEventListener('mousewheel', wheel);
    canvas.addEventListener('DOMMouseScroll', wheel); //兼容火狐
}

function initVertexBuffers(gl) {
    const vertices = new Float32Array([
        // Vertex coordinates
        1.0,
        1.0,
        1.0,
        -1.0,
        1.0,
        1.0,
        -1.0,
        -1.0,
        1.0,
        1.0,
        -1.0,
        1.0, // v0-v1-v2-v3 front
        1.0,
        1.0,
        1.0,
        1.0,
        -1.0,
        1.0,
        1.0,
        -1.0,
        -1.0,
        1.0,
        1.0,
        -1.0, // v0-v3-v4-v5 right
        1.0,
        1.0,
        1.0,
        1.0,
        1.0,
        -1.0,
        -1.0,
        1.0,
        -1.0,
        -1.0,
        1.0,
        1.0, // v0-v5-v6-v1 up
        -1.0,
        1.0,
        1.0,
        -1.0,
        1.0,
        -1.0,
        -1.0,
        -1.0,
        -1.0,
        -1.0,
        -1.0,
        1.0, // v1-v6-v7-v2 left
        -1.0,
        -1.0,
        -1.0,
        1.0,
        -1.0,
        -1.0,
        1.0,
        -1.0,
        1.0,
        -1.0,
        -1.0,
        1.0, // v7-v4-v3-v2 down
        1.0,
        -1.0,
        -1.0,
        -1.0,
        -1.0,
        -1.0,
        -1.0,
        1.0,
        -1.0,
        1.0,
        1.0,
        -1.0, // v4-v7-v6-v5 back
    ]);

    const color = new Float32Array([
        0.2,
        0.58,
        0.82,
        0.2,
        0.58,
        0.82,
        0.2,
        0.58,
        0.82,
        0.2,
        0.58,
        0.82, // v0-v1-v2-v3 front
        0.5,
        0.41,
        0.69,
        0.5,
        0.41,
        0.69,
        0.5,
        0.41,
        0.69,
        0.5,
        0.41,
        0.69, // v0-v3-v4-v5 right
        0.0,
        0.32,
        0.61,
        0.0,
        0.32,
        0.61,
        0.0,
        0.32,
        0.61,
        0.0,
        0.32,
        0.61, // v0-v5-v6-v1 up
        0.78,
        0.69,
        0.84,
        0.78,
        0.69,
        0.84,
        0.78,
        0.69,
        0.84,
        0.78,
        0.69,
        0.84, // v1-v6-v7-v2 left
        0.32,
        0.18,
        0.56,
        0.32,
        0.18,
        0.56,
        0.32,
        0.18,
        0.56,
        0.32,
        0.18,
        0.56, // v7-v4-v3-v2 down
        0.73,
        0.82,
        0.93,
        0.73,
        0.82,
        0.93,
        0.73,
        0.82,
        0.93,
        0.73,
        0.82,
        0.93, // v4-v7-v6-v5 back
    ]);

    // 索引坐标
    const indices = new Uint8Array([
        0,
        1,
        2,
        0,
        2,
        3, // front
        4,
        5,
        6,
        4,
        6,
        7, // right
        8,
        9,
        10,
        8,
        10,
        11, // up
        12,
        13,
        14,
        12,
        14,
        15, // left
        16,
        17,
        18,
        16,
        18,
        19, // down
        20,
        21,
        22,
        20,
        22,
        23, // back
    ]);

    //将顶点和颜色存储到缓冲区
    initArrayBuffer(gl, vertices, 3, gl.FLOAT, 'a_Position');
    initArrayBuffer(gl, color, 3, gl.FLOAT, 'a_color');


    // 绑定索引
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    return indices.length;
}

function initArrayBuffer(gl, data, num, type, attribute) {
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    const a_attribute = gl.getAttribLocation(gl.program, attribute);
    gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
    gl.enableVertexAttribArray(a_attribute);
    return true;
}


function draw(gl, n, u_MvpMatrix, currentAngle) {
    const _matrix = new CameraMatrix();
    // 投影矩阵
    const p_matrix = _matrix.perspective(
        30.0,
        canvas.width / canvas.height,
        1.0,
        100.0
    );
    // 视图矩阵
    const v_matrix = _matrix.lookAt(
        [0.0, 0.0, currentAngle[2]],
        [0.0, 0.0, 0.0],
        [0.0, 1.0, 0.0]
    );
    const pv_matrix = _matrix.cMultiply(p_matrix, v_matrix);
    let mol_matrix = _matrix.xRotate(currentAngle[0]);
    mol_matrix = _matrix.cMultiply(
        mol_matrix,
        _matrix.yRotate(currentAngle[1])
    );
    // 最终变化矩阵
    let mvp_matrix = new CameraMatrix(_matrix.cMultiply(pv_matrix, mol_matrix));
    // 进行转置 我们用的是列表达 转换为行表达
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvp_matrix.transpose().data);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
}