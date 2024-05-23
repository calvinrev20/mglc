const tf = require("@tensorflow/tfjs-node");
const InputError = require("../exceptions/InputError");

async function predictClassification(model, image) {
  try {
    const tensor = tf.node
      .decodeJpeg(image)
      .resizeNearestNeighbor([224, 224])
      .expandDims()
      .toFloat();

    const prediction = model.predict(tensor);
    const probabilities = await prediction.data();
    const cancerProbability = probabilities[0];

    const label = cancerProbability > 0.5 ? "Cancer" : "Non-cancer";

    let suggestion;

    if (label === "Cancer") {
      suggestion = "Segera periksa ke dokter!";
    }

    if (label === "Non-cancer") {
      suggestion = "Tidak perlu khawatir, tetap jaga kesehatan!";
    }
    return { label, suggestion };
  } catch (error) {
    console.error("Error in predictClassification:", error);
    throw new InputError(`Error in prediction: ${error.message}`);
  }
}

module.exports = predictClassification;
