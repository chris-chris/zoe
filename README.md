# ZOE: ZKML Optimization Engine

ZOE is a powerful command-line tool designed to optimize and manage ZKML (Zero-Knowledge Machine Learning) tasks. This tool offers a variety of commands to perform different ZK-related operations.

## Installation
You can install ZOE globally using npm:

```bash
npm install -g zoe-cli
```

Alternatively, you can clone this project and run it directly:

```bash
git clone https://github.com/your-repo/zoe.git
cd zoe
npm install
npm link
```

## Usage
ZOE supports a variety of commands. Below is a description of each command.

### 1. gen-srs

Generates a Structured Reference String (SRS).

```bash
zoe gen-srs <srs_path> <logrows> [commitment]
```
- srs_path: Path where the SRS file will be generated.
- logrows: Number of log rows.
- commitment: (Optional) Default is kzg.

### 2. get-srs

Retrieves SRS based on the settings.

```bash
zoe get-srs <srs_path> <settings_path> <logrows> [commitment]
```
- srs_path: Path to the SRS file.
- settings_path: Path to the settings file.
- logrows: Number of log rows.
- commitment: (Optional) Default is kzg.

### 3. table

Generates a table based on the model and arguments.

```bash
zoe table <model> [args...]
```
- model: Path to the model file.
- args: (Optional) Additional arguments.

### 4. gen-settings

Generates circuit settings.

```bash
zoe gen-settings <model> <settings_path> [args...]
```

- model: Path to the model file.
- settings_path: Path where the settings file will be saved.
- args: (Optional) Additional arguments.

### 5. calibrate-settings

Calibrates circuit settings.

```bash
zoe calibrate-settings <model> <settings_path> <data> <target> <lookup_safety_margin> <scales> <scale_rebase_multiplier> [max_logrows] [only_range_check_rebase]
```

- model: Path to the model file.
- settings_path: Path to the settings file.
- data: Path to the data file.
- target: Calibration target.
- lookup_safety_margin: Lookup safety margin.
- scales: Scales.
- scale_rebase_multiplier: Scale rebase multiplier.
- max_logrows: (Optional) Maximum log rows.
- only_range_check_rebase: (Optional) Only range check rebase.

### 6. gen-witness

Generates a witness.

```bash
zoe gen-witness <data> <compiled_circuit> <output> <vk_path> <srs_path>
```

- data: Path to the data file.
- compiled_circuit: Path to the compiled circuit file.
- output: Path where the output file will be saved.
- vk_path: Path to the verification key file.
- srs_path: Path to the SRS file.

### 7. mock

Performs a mock execution based on the model and witness.

```bash
zoe mock <model> <witness>
```

- model: Path to the model file.
- witness: Path to the witness file.

### 8. create-evm-verifier

Creates an EVM verifier.

```bash
zoe create-evm-verifier <srs_path> [vk_path] [settings_path] [sol_code_path] [abi_path] [render_vk_separately]
```

- srs_path: Path to the SRS file.
- vk_path: (Optional) Path to the verification key file.
- settings_path: (Optional) Path to the settings file.
- sol_code_path: (Optional) Path to the Solidity code file.
- abi_path: (Optional) Path to the ABI file.
- render_vk_separately: (Optional) Whether to render the VK separately.

### 9. encode-evm-calldata

Encodes EVM calldata.

```bash
zoe encode-evm-calldata <addr_vk> [proof_path] [calldata_path]
```

- addr_vk: Address of the verification key.
- proof_path: (Optional) Path to the proof file.
- calldata_path: (Optional) Path to the calldata file.

### 10. create-evm-vk
Creates an EVM verification key.

```bash
zoe create-evm-vk <srs_path> [vk_path] [settings_path] [sol_code_path] [abi_path]
```

- srs_path: Path to the SRS file.
- vk_path: (Optional) Path to the verification key file.
- settings_path: (Optional) Path to the settings file.
- sol_code_path: (Optional) Path to the Solidity code file.
- abi_path: (Optional) Path to the ABI file.

### 11. create-evm-data-attestation

Creates an EVM data attestation.

```bash
zoe create-evm-data-attestation <witness> [settings_path] [sol_code_path] [abi_path] [data]
```

- witness: Path to the witness file.
- settings_path: (Optional) Path to the settings file.
- sol_code_path: (Optional) Path to the Solidity code file.
- abi_path: (Optional) Path to the ABI file.
- data: (Optional) Path to the data file.

### 12. create-evm-verifier-aggr

Creates an aggregated EVM verifier.

```bash
zoe create-evm-verifier-aggr <srs_path> <aggregation_settings> [vk_path] [sol_code_path] [abi_path] [logrows] [render_vk_separately]
```

- srs_path: Path to the SRS file.
- aggregation_settings: Path to the aggregation settings file.
- vk_path: (Optional) Path to the verification key file.
- sol_code_path: (Optional) Path to the Solidity code file.
- abi_path: (Optional) Path to the ABI file.
- logrows: (Optional) Number of log rows.
- render_vk_separately: (Optional) Whether to render the VK separately.

### 13. compile-circuit

Compiles a circuit.

```bash
zoe compile-circuit <model> [compiled_circuit] [settings_path]
```

- model: Path to the model file.
- compiled_circuit: (Optional) Path to the compiled circuit file.
- settings_path: (Optional) Path to the settings file.

### 14. setup

Sets up the circuit.

```bash
zoe setup <srs_path> <witness> [compiled_circuit] [vk_path] [pk_path] [disable_selector_compression]
````

srs_path: Path to the SRS file.
witness: Path to the witness file.
compiled_circuit: (Optional) Path to the compiled circuit file.
vk_path: (Optional) Path to the verification key file.
pk_path: (Optional) Path to the proving key file.
disable_selector_compression: (Optional) Whether to disable selector compression.

## Default Settings

ZOE provides various default settings. You can find and modify these settings in the defaults.ts file as needed.

## Contributing

Contributions are welcome! To contribute to this project, follow these steps:

- Fork this repository.
- Create a new branch: git checkout -b feature/your-feature-name
- Commit your changes: git commit -m 'Add some feature'
- Push to the branch: git push origin feature/your-feature-name
- Create a pull request.

## License

This project is licensed under the Apache 2.0 License. See the LICENSE file for details.