# Dataset Details

## Dataset Title
K-NET & KiK-net Seismic Waveform Dataset

---

## Usage of Dataset
This dataset is used to train and evaluate the deep learning model for **early estimation of earthquake parameters** such as magnitude, epicentral distance, azimuth, and focal depth.  
It enables learning from real seismic waveforms recorded immediately after P-wave arrival, supporting rapid and reliable early warning predictions.

---

## Dataset Information

**Dataset Name:**  
K-NET and KiK-net Strong Motion Seismic Networks  

**Source:**  
National Research Institute for Earth Science and Disaster Resilience (NIED), Japan  

**Domain:**  
Seismology / Earthquake Early Warning

**Task:**  
Multi-output regression for earthquake parameter prediction

**Problem Type:**  
Time-series forecasting & spatial estimation

**File Format:**  
Waveform records, metadata tables

**Dataset Link:**  
http://www.kyoshin.bosai.go.jp

---

## Dataset Overview

**Total Records:**  
Large-scale nationwide recordings from thousands of earthquake events and stations.

**Labeled Records:**  
Each waveform is associated with ground-truth parameters such as magnitude, epicentral distance, azimuth, focal depth, and station coordinates.

**Classes:**  
Not a classification dataset. Continuous regression targets are used.

**Annotation Type:**  
Instrument-recorded seismic measurements with official catalog values.

---

## Why This Dataset?
- Real-world high-quality seismic recordings.
- Dense station coverage across Japan improves spatial generalization.
- Standard benchmark widely used in earthquake early warning research.
- Provides both waveform signals and rich geospatial metadata.
- Suitable for evaluating deep learning models under realistic conditions.

---

## Features Used

**Feature 1:**  
Three-component ground motion waveforms (Vertical, North–South, East–West).

**Feature 2:**  
3-second window after P-wave arrival (300 × 3 input).

**Feature 3:**  
Event and station metadata (magnitude, distance, azimuth, depth, latitude, longitude).

---

## Summary
The K-NET and KiK-net datasets provide comprehensive, strong-motion seismic recordings essential for building reliable earthquake early warning systems. Their combination of high-resolution waveform data and precise geophysical annotations enables effective training of deep neural networks for rapid, multi-parameter estimation in real-time scenarios.
