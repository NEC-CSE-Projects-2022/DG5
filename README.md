# Team DG5 – Earthquake Prediction Using Deep Learning with Spatiotemporal Priors

## Team Info
- **22471A05L1 — Ammisetty Chamundeswari**  
  ([LinkedIn](https://www.linkedin.com/in/chamundeswari-ammisetty-371676287/))  
  _Work Done: Model design, training implementation, GitHub structuring_

- **22471A05O4 — Tadi Anusha**  
  ([LinkedIn](https://www.linkedin.com/in/tadi-anusha-527a3a289))  
  _Work Done: Data preprocessing, feature extraction, dataset handling_

- **23475A0509 — Chaganti Rethika Reddy**  
  ([LinkedIn](https://www.linkedin.com/in/rethika-reddy-58aa1b32a))  
  _Work Done: Model evaluation, results analysis, documentation_

---

## Abstract
Performing a timely and accurate estimation of earthquake parameters is vital for effective earthquake early warning systems. Traditional staged models that rely on shallow regressors often suffer from high latency and limited generalization capability. This project presents a unified deep learning framework that jointly predicts earthquake magnitude, epicentral distance, azimuth, and focal depth using raw three-second seismic waveform data along with geospatial metadata. The proposed architecture combines Convolutional Neural Networks (CNNs), Bidirectional Long Short-Term Memory networks (BiLSTMs), and Transformer encoders to capture local spatial features, temporal dependencies, and long-range contextual information. Handcrafted statistical features such as peak displacement and amplitude-based measures are integrated to enhance robustness. Monte Carlo dropout is employed for uncertainty estimation, while model interpretability is improved through attention visualization and SHAP analysis. Experiments conducted on the K-NET and KiK-net seismic datasets demonstrate low mean absolute error values, indicating improved accuracy and strong generalization performance. The proposed end-to-end framework is well-suited for real-time seismic early warning applications across diverse tectonic settings.

---

## Paper Reference (Inspiration)
👉 **[A Deep Attention Model for Onsite Estimation of Earthquake Epicenter Distance and Magnitude  
– S. Mousavi, G. C. Beroza et al.](https://ieeexplore.ieee.org/document/10679183)**  
An original IEEE research paper was used as inspiration for the proposed deep learning model.

---

## Our Improvement Over Existing Paper
- Extended the attention-based approach to a unified multi-task model that jointly predicts magnitude, epicentral distance, azimuth, and focal depth  
- Designed a simplified and modular implementation suitable for academic and reproducible research  
- Integrated handcrafted statistical features with deep features to improve robustness and stability  
- Enhanced model interpretability using attention visualization and SHAP-based feature importance analysis  
- Optimized preprocessing, normalization, and training strategy to ensure stable convergence and better generalization  

---

## About the Project
- **What the project does:**  
  Predicts earthquake magnitude, epicentral distance, azimuth, and focal depth.

- **Why it is useful:**  
  Enables early warnings that help reduce damage and save lives.

- **Project Workflow:**  
  Seismic waveform input  
  → Preprocessing & feature extraction  
  → CNN + BiLSTM + Transformer model  
  → Multi-parameter prediction  
  → Evaluation & analysis

---

## Dataset Used
👉 **[K-NET and KiK-net Seismic Datasets – NIED, Japan](http://www.kyoshin.bosai.go.jp)**

**Dataset Details:**
- Seismic waveform data collected from Japan’s K-NET and KiK-net networks maintained by the National Research Institute for Earth Science and Disaster Resilience (NIED)
- Three-component ground motion recordings: Vertical (Z), North–South (N), and East–West (E)
- Sampling frequency of 100 Hz
- Each sample consists of a 3-second waveform segment captured immediately after P-wave arrival
- Waveform input shape: 300 × 3
- Associated metadata includes earthquake magnitude (Mw), epicentral distance (km), azimuth (°), focal depth (km), and station coordinates (latitude and longitude)
- The dataset provides wide spatial coverage across seismic stations and epicenters, improving model generalization
- Due to large size and licensing restrictions, the dataset is not included in this repository
- The dataset is used strictly for academic and research purposes

---

## Dependencies Used
- Python  
- NumPy  
- Pandas  
- TensorFlow  
- Keras  
- Scikit-learn  
- Matplotlib  
- SciPy  
- SHAP  

---

## EDA & Preprocessing
- Removal of mean and baseline drift from raw seismic waveforms  
- Z-score normalization applied to waveform amplitudes  
- Butterworth bandpass filtering in the range of 0.1–20 Hz to remove noise  
- Segmentation of 3-second waveform windows after P-wave arrival  
- Extraction of handcrafted statistical features including peak displacement, mean, standard deviation, skewness, and kurtosis  
- Min–Max normalization applied to target variables (magnitude, distance, azimuth, depth)  
- Dataset split into training, validation, and testing sets to avoid data leakage  

---

## Model Training Info
- Framework: TensorFlow with Keras API  
- Model Architecture: CNN + BiLSTM + Transformer encoder (multi-task learning)  
- Optimizer: Adam  
- Initial Learning Rate: 1e-4  
- Epochs: Up to 100 with early stopping based on validation loss  
- Batch Size: 64  
- Loss Function: Mean Squared Error (MSE) for multi-output regression  
- Regularization: Dropout layers with Monte Carlo Dropout for uncertainty estimation  

---

## Model Testing / Evaluation
The trained model is evaluated on unseen test data using the following metrics:
- Mean Absolute Error (MAE)  
- Mean Squared Error (MSE)  
- R² Score  

Evaluation is performed separately for each predicted parameter (magnitude, epicentral distance, azimuth, and focal depth) to ensure robustness and generalization.

---

## Results
- Magnitude MAE: **0.18**  
- Epicentral Distance MAE: **5.21 km**  
- Azimuth MAE: **13.6°**  
- Focal Depth MAE: **2.7 km**  

The proposed hybrid deep learning model consistently outperforms baseline CNN-only and BiLSTM-only architectures in terms of prediction accuracy and stability.

---

## Limitations & Future Work
**Limitations:**
- Model evaluation is limited to Japanese seismic datasets (K-NET and KiK-net)  
- Performance may be affected by noisy signals or low-quality seismic sensors  

**Future Work:**
- Validation on global and region-diverse seismic datasets  
- Deployment on edge devices for real-time earthquake early warning  
- Integration with live seismic monitoring and alerting systems  

---

## Deployment Info
- Implemented as an offline research prototype  
- Designed with real-time inference compatibility in mind  
- Can be deployed using lightweight web frameworks such as Flask or FastAPI  
- Suitable for integration into early warning pipelines after further optimization  
- Current implementation focuses on research validation rather than production deployment  
