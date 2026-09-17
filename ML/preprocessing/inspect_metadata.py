import h5py

file_path = r"Data/satellite/NISAR_.h5"

with h5py.File(file_path, "r") as f:

    paths = [
        "science/SSAR/GCOV/metadata/ceosAnalysisReadyData/outputBackscatterDecibelConversionFormula",

        "science/SSAR/GCOV/metadata/processingInformation/parameters/rtc/inputBackscatterNormalizationConvention",

        "science/SSAR/GCOV/metadata/processingInformation/parameters/rtc/outputBackscatterExpressionConvention",

        "science/SSAR/GCOV/metadata/processingInformation/parameters/rtc/outputBackscatterNormalizationConvention",
    ]

    for path in paths:

        print("\n" + "=" * 70)
        print(path)
        print("=" * 70)

        try:
            data = f[path][()]

            print("Value:")
            print(data)

        except Exception as e:
            print("Could not read:")
            print(e)