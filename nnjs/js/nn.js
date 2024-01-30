function linear(xs, ws, b) {
    if (Array.isArray(xs) && Array.isArray(ws)) {
        let s = 0;
        for (let i = 0; i < xs.length; i++) {
            let x = xs[i];
            let w = ws[i];
            s += w * x;
        }
        return s + b;
    }
    return ws * xs + b;
}

function linearOnObj(xs, ws, b) {
    if (Array.isArray(xs) && Array.isArray(ws)) {
        let s = 0;
        for (let i = 0; i < xs.length; i++) {
            let x = xs[i];
            let w = ws[i];
            s += w * x.h;
        }
        return s + b;
    }
    return ws * xs + b;
}

function sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
}

function softmax(x, xs) {
    let denominator = 0;
    for (let i = 0; i < xs.length; i++) {
        let ex = xs[i];
        let ed = Math.exp(ex);
        denominator += ed;
    }
    return Math.exp(x) / denominator;
}

function derivativeSigmoid(x) {
    return sigmoid(x) * (1 - sigmoid(x));
}

function loss(outputs, yTrains) {
    let c = 0;
    for (let i = 0; i < outputs.length; i++) {
        let y = yTrains[i];
        let o = outputs[i];
        c += (1/2) * Math.pow(y - o.h, 2);
    }

    return c;
}

function calculateDerivativeCost(output, yTrue, yTrains) {
    return 2 * (1/2) * (yTrue - output) * -1;
}

function argmax(arrs) {
    let currIndex = 0;
    let arr = arrs[0].h;
    for (let i = 0; i < arrs.length; i++) {
        if (arrs[i].h > arr) {
            currIndex = i;
            arr = arrs[i].h;
        }
    }

    return currIndex;
}

class NNetwork {
    constructor(epochs, learningRate) {
        this.epochs = epochs;
        this.learningRate = learningRate;

        this.ws1 = [];
        this.ws2 = [];
        this.ws3 = [];
        this.bs1 = [];
        this.bs2 = [];
        this.bs3 = [];

        for (let i = 0; i < 20; i++) {
            let ws = [];
            for (let j = 0; j < 784; j++) {
                let w = Math.random();
                w = w / Math.pow(784, 0.5);
                ws.push(w);
            }

            this.ws1.push(ws);
            
        }

        for (let i = 0; i < 20; i++) {
            let ws = [];
            for (let j = 0; j < 20; j++) {
                let w = Math.random();
                w = w / Math.pow(20, 0.5);
                ws.push(w);
            }

            this.ws2.push(ws);
            
        }

        for (let i = 0; i < 10; i++) {
            let ws = [];
            for (let j = 0; j < 20; j++) {
                let w = Math.random();
                w = w / Math.pow(20, 0.5);
                ws.push(w);
            }

            this.ws3.push(ws);
            
        }

        for (let i = 0; i < 20; i++) {
            let b = Math.random();
            this.bs1.push(b);
        }

        for (let i = 0; i < 20; i++) {
            let b = Math.random();
            this.bs2.push(b);
        }

        for (let i = 0; i < 10; i++) {
            let b = Math.random();
            this.bs3.push(b);
        }
    }

    train(xTrains, yTrains) {
        
        for (let e = 0; e < this.epochs; e++) {
            console.log('epochs: ', e);

            for (let d = 0; d < yTrains.length; d++) {
                let xTrain = xTrains[d];
                let yTrain = yTrains[d];
                // forward propagation

                // first hidden layer
                let zh1 = [];
                for (let i = 0; i < this.ws1.length; i++) {
                    let ws = this.ws1[i];
                    let b = this.bs1[i];

                    let z = linear(xTrain, ws, b);
                    let h = sigmoid(z);

                    zh1.push({z: z, h: h});
                }

                // second hidden layer
                let zh2 = [];
                for (let i = 0; i < this.ws2.length; i++) {
                    let ws = this.ws2[i];
                    let b = this.bs2[i];

                    let z = linearOnObj(zh1, ws, b);
                    let h = sigmoid(z);

                    zh2.push({z: z, h: h});
                }

                // output layer
                let zh3 = [];
                for (let i = 0; i < this.ws3.length; i++) {
                    let ws = this.ws3[i];
                    let b = this.bs3[i];

                    let z = linearOnObj(zh2, ws, b);
                    let h = sigmoid(z);

                    zh3.push({z: z, h: h});
                }

                // if (e % 10 == 0) {
                //     let cost = loss(zh3, yTrain);
                //     console.log('epochs: ', e, ' | loss: ', cost);
                // }

                let cost = loss(zh3, yTrain);
                console.log('epochs: ', e, ' | loss: ', cost);

                // backward propagation
                let derivativeCosts = [];
                for (let i = 0; i < zh3.length; i++) {
                    let yt = yTrain[i];
                    let h = zh3[i].h;
                    let derivativeCost = calculateDerivativeCost(h, yt, yTrain);
                    // console.log(h, ' - ', yt, ' = ', derivativeCost);
                    
                    derivativeCosts.push(derivativeCost);
                }

                for (let i = derivativeCosts.length-1; i >= 0; i--) {
                    let dc = derivativeCosts[i];
                    let ws = this.ws3[i];
                    
                    let zh = zh3[i];
                    let updatedBias = 0;
                    for (let k = ws.length-1; k >= 0; k--) {
                        let zh2Temp = zh2[k];
                        // console.log(i, ' ', k);
                        let updatedWeight = dc * derivativeSigmoid(zh.z) * zh2Temp.h;
                        this.ws3[i][k] = this.ws3[i][k] - this.learningRate * updatedWeight;
                        if (k == 0) {
                            updatedBias = dc * derivativeSigmoid(zh.z) * 1;
                        }
                    }
                    // console.log('--');

                    this.bs3[i] = this.bs3[i] - this.learningRate * updatedBias;
                }

                for (let i = zh2.length-1; i >= 0; i--) {
                    let zh2Temp = zh2[i];
                    let ws2Temps = this.ws2[i];

                    let updatedBias = 0;
                    for (let j = ws2Temps.length-1; j >= 0; j--) {
                        let zh1Temp = zh1[j];
                        let updatedWeight = 0;
                        for (let k = derivativeCosts.length-1; k >= 0; k--) {
                            // console.log(k, ' ', i, ' ', j);
                            let zh3Temp = zh3[k];
                            let dc = derivativeCosts[k];
                            updatedWeight += dc * 
                                derivativeSigmoid(zh3Temp.z) * 
                                this.ws3[k][i] * 
                                derivativeSigmoid(zh2Temp.z) * 
                                zh1Temp.h;
                            
                            if (j == 0) {
                                updatedBias += dc * 
                                    derivativeSigmoid(zh3Temp.z) * 
                                    this.ws3[k][i] * 
                                    derivativeSigmoid(zh2Temp.z) * 
                                    1;
                            }
                        }

                        this.ws2[i][j] = this.ws2[i][j] - this.learningRate * updatedWeight;
                    }
                    // console.log('--');

                    this.bs2[i] = this.bs2[i] - this.learningRate * updatedBias;
                }

                for (let i = zh1.length-1; i >= 0; i--) {
                    let ws1Temps = this.ws1[i];
                    let zh1Temp = zh1[i];

                    let updatedBias = 0;
                    for (let j = ws1Temps.length-1; j >= 0; j--) {
                        let x = xTrain[j];

                        let updatedWeight = 0;
                        for (let k = derivativeCosts.length-1; k >= 0; k--) {
                            let zh3Temp = zh3[k];
                            let dc = derivativeCosts[k];
                            
                            for (let m = zh2.length - 1; m >= 0; m--) {
                                // console.log(k, ' ', m, ' ', i, ' ', j);
                                let zh2Temp = zh2[m];
                                
                                updatedWeight += dc * 
                                    derivativeSigmoid(zh3Temp.z) * 
                                    this.ws3[k][m] * 
                                    derivativeSigmoid(zh2Temp.z) * 
                                    this.ws2[m][i] * 
                                    derivativeSigmoid(zh1Temp.z) * 
                                    x;

                                if (j == 0) {
                                    updatedBias += dc * 
                                        derivativeSigmoid(zh3Temp.z) * 
                                        this.ws3[k][m] * 
                                        derivativeSigmoid(zh2Temp.z) * 
                                        this.ws2[m][i] * 
                                        derivativeSigmoid(zh1Temp.z) * 
                                        1;
                                }
                            }
                        }

                        this.ws1[i][j] = this.ws1[i][j] - this.learningRate * updatedWeight;
                    }
                    // console.log('--');
                    this.bs1[i] = this.bs1[i] - this.learningRate * updatedBias;
                }

                // if (e % 10 == 0) {
                //     this.saveModel();
                // }
            }
        }
    }

    forward(x) {
        // first hidden layer
        let zh1 = [];
        for (let i = 0; i < this.ws1.length; i++) {
            let ws = this.ws1[i];
            let b = this.bs1[i];

            let z = linear(x, ws, b);
            let h = sigmoid(z);

            zh1.push({z: z, h: h});
        }

        // second hidden layer
        let zh2 = [];
        for (let i = 0; i < this.ws2.length; i++) {
            let ws = this.ws2[i];
            let b = this.bs2[i];

            let z = linearOnObj(zh1, ws, b);
            let h = sigmoid(z);

            zh2.push({z: z, h: h});
        }

        // output layer
        let zh3 = [];
        for (let i = 0; i < this.ws3.length; i++) {
            let ws = this.ws3[i];
            let b = this.bs3[i];

            let z = linearOnObj(zh2, ws, b);
            let h = sigmoid(z);

            zh3.push({z: z, h: h});
        }

        return zh3;
    }

    saveModel(name) {
        
    }

    loadModel(name) {
        fetch(name)
            .then((response) => response.json())
            .then((model) => {

                this.ws1 = model.layer1.weights;
                this.bs1 = model.layer1.biases;

                this.ws2 = model.layer2.weights;
                this.bs2 = model.layer2.biases;

                this.ws3 = model.layer3.weights;
                this.bs3 = model.layer3.biases;
            }).catch(e => console.log('open model file error ', e));
    }
}
