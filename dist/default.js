"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_COMMITMENT = exports.DEFAULT_ONLY_RANGE_CHECK_REBASE = exports.DEFAULT_USE_REDUCED_SRS_FOR_VERIFICATION = exports.DEFAULT_SCALE_REBASE_MULTIPLIERS = exports.DEFAULT_VK_ABI = exports.DEFAULT_VK_SOL = exports.DEFAULT_RENDER_VK_SEPARATELY = exports.DEFAULT_DISABLE_SELECTOR_COMPRESSION = exports.DEFAULT_LOOKUP_SAFETY_MARGIN = exports.DEFAULT_CALIBRATION_FILE = exports.DEFAULT_FUZZ_RUNS = exports.DEFAULT_OPTIMIZER_RUNS = exports.DEFAULT_AGGREGATED_LOGROWS = exports.DEFAULT_CALIBRATION_TARGET = exports.DEFAULT_CHECKMODE = exports.DEFAULT_CONTRACT_ADDRESS_VK = exports.DEFAULT_CONTRACT_ADDRESS_DA = exports.DEFAULT_CONTRACT_ADDRESS = exports.DEFAULT_SOL_CODE_DA = exports.DEFAULT_SOL_CODE_AGGREGATED = exports.DEFAULT_CALLDATA = exports.DEFAULT_SOL_CODE = exports.DEFAULT_VERIFIER_DA_ABI = exports.DEFAULT_VERIFIER_AGGREGATED_ABI = exports.DEFAULT_VERIFIER_ABI = exports.DEFAULT_SPLIT = exports.DEFAULT_PROOF_AGGREGATED = exports.DEFAULT_PROOF = exports.DEFAULT_VK_AGGREGATED = exports.DEFAULT_PK_AGGREGATED = exports.DEFAULT_VK = exports.DEFAULT_PK = exports.DEFAULT_SETTINGS = exports.DEFAULT_WITNESS = exports.DEFAULT_COMPILED_CIRCUIT = exports.DEFAULT_MODEL = exports.DEFAULT_DATA = void 0;
// The default path to the .json data file
exports.DEFAULT_DATA = "input.json";
// The default path to the .onnx model file
exports.DEFAULT_MODEL = "network.onnx";
// The default path to the compiled model file
exports.DEFAULT_COMPILED_CIRCUIT = "model.compiled";
// The default path to the .json witness file
exports.DEFAULT_WITNESS = "witness.json";
// The default path to the circuit settings file
exports.DEFAULT_SETTINGS = "settings.json";
// The default path to the proving key file
exports.DEFAULT_PK = "pk.key";
// The default path to the verification key file
exports.DEFAULT_VK = "vk.key";
// The default path to the proving key file for aggregated proofs
exports.DEFAULT_PK_AGGREGATED = "pk_aggr.key";
// The default path to the verification key file for aggregated proofs
exports.DEFAULT_VK_AGGREGATED = "vk_aggr.key";
// The default path to the proof file
exports.DEFAULT_PROOF = "proof.json";
// The default path to the proof file for aggregated proofs
exports.DEFAULT_PROOF_AGGREGATED = "proof_aggr.json";
// Default for whether to split proofs
exports.DEFAULT_SPLIT = "false";
// Default verifier abi
exports.DEFAULT_VERIFIER_ABI = "verifier_abi.json";
// Default verifier abi for aggregated proofs
exports.DEFAULT_VERIFIER_AGGREGATED_ABI = "verifier_aggr_abi.json";
// Default verifier abi for data attestation
exports.DEFAULT_VERIFIER_DA_ABI = "verifier_da_abi.json";
// Default solidity code
exports.DEFAULT_SOL_CODE = "evm_deploy.sol";
// Default calldata path
exports.DEFAULT_CALLDATA = "calldata.bytes";
// Default solidity code for aggregated proofs
exports.DEFAULT_SOL_CODE_AGGREGATED = "evm_deploy_aggr.sol";
// Default solidity code for data attestation
exports.DEFAULT_SOL_CODE_DA = "evm_deploy_da.sol";
// Default contract address
exports.DEFAULT_CONTRACT_ADDRESS = "contract.address";
// Default contract address for data attestation
exports.DEFAULT_CONTRACT_ADDRESS_DA = "contract_da.address";
// Default contract address for vk
exports.DEFAULT_CONTRACT_ADDRESS_VK = "contract_vk.address";
// Default check mode
exports.DEFAULT_CHECKMODE = "safe";
// Default calibration target
exports.DEFAULT_CALIBRATION_TARGET = "resources";
// Default logrows for aggregated proofs
exports.DEFAULT_AGGREGATED_LOGROWS = 23;
// Default optimizer runs
exports.DEFAULT_OPTIMIZER_RUNS = 1;
// Default fuzz runs
exports.DEFAULT_FUZZ_RUNS = "10";
// Default calibration file
exports.DEFAULT_CALIBRATION_FILE = "calibration.json";
// Default lookup safety margin
exports.DEFAULT_LOOKUP_SAFETY_MARGIN = "2";
// Default Compress selectors
exports.DEFAULT_DISABLE_SELECTOR_COMPRESSION = false;
// Default render vk separately
exports.DEFAULT_RENDER_VK_SEPARATELY = false;
// Default VK sol path
exports.DEFAULT_VK_SOL = "vk.sol";
// Default VK abi path
exports.DEFAULT_VK_ABI = "vk.abi";
// Default scale rebase multipliers for calibration
exports.DEFAULT_SCALE_REBASE_MULTIPLIERS = "1,2,10";
// Default use reduced srs for verification
exports.DEFAULT_USE_REDUCED_SRS_FOR_VERIFICATION = false;
// Default only check for range check rebase
exports.DEFAULT_ONLY_RANGE_CHECK_REBASE = false;
// Default commitment
exports.DEFAULT_COMMITMENT = "kzg";
//# sourceMappingURL=default.js.map