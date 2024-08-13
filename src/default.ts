// The default path to the .json data file
export const DEFAULT_DATA: string = "input.json";
// The default path to the .onnx model file
export const DEFAULT_MODEL: string = "network.onnx";
// The default path to the compiled model file
export const DEFAULT_COMPILED_CIRCUIT: string = "model.compiled";
// The default path to the .json witness file
export const DEFAULT_WITNESS: string = "witness.json";
// The default path to the circuit settings file
export const DEFAULT_SETTINGS: string = "settings.json";
// The default path to the proving key file
export const DEFAULT_PK: string = "pk.key";
// The default path to the verification key file
export const DEFAULT_VK: string = "vk.key";
// The default path to the proving key file for aggregated proofs
export const DEFAULT_PK_AGGREGATED: string = "pk_aggr.key";
// The default path to the verification key file for aggregated proofs
export const DEFAULT_VK_AGGREGATED: string = "vk_aggr.key";
// The default path to the proof file
export const DEFAULT_PROOF: string = "proof.json";
// The default path to the proof file for aggregated proofs
export const DEFAULT_PROOF_AGGREGATED: string = "proof_aggr.json";
// Default for whether to split proofs
export const DEFAULT_SPLIT: string = "false";
// Default verifier abi
export const DEFAULT_VERIFIER_ABI: string = "verifier_abi.json";
// Default verifier abi for aggregated proofs
export const DEFAULT_VERIFIER_AGGREGATED_ABI: string = "verifier_aggr_abi.json";
// Default verifier abi for data attestation
export const DEFAULT_VERIFIER_DA_ABI: string = "verifier_da_abi.json";
// Default solidity code
export const DEFAULT_SOL_CODE: string = "evm_deploy.sol";
// Default calldata path
export const DEFAULT_CALLDATA: string = "calldata.bytes";
// Default solidity code for aggregated proofs
export const DEFAULT_SOL_CODE_AGGREGATED: string = "evm_deploy_aggr.sol";
// Default solidity code for data attestation
export const DEFAULT_SOL_CODE_DA: string = "evm_deploy_da.sol";
// Default contract address
export const DEFAULT_CONTRACT_ADDRESS: string = "contract.address";
// Default contract address for data attestation
export const DEFAULT_CONTRACT_ADDRESS_DA: string = "contract_da.address";
// Default contract address for vk
export const DEFAULT_CONTRACT_ADDRESS_VK: string = "contract_vk.address";
// Default check mode
export const DEFAULT_CHECKMODE: string = "safe";
// Default calibration target
export const DEFAULT_CALIBRATION_TARGET: string = "resources";
// Default logrows for aggregated proofs
export const DEFAULT_AGGREGATED_LOGROWS: number = 23;
// Default optimizer runs
export const DEFAULT_OPTIMIZER_RUNS: number = 1;
// Default fuzz runs
export const DEFAULT_FUZZ_RUNS: string = "10";
// Default calibration file
export const DEFAULT_CALIBRATION_FILE: string = "calibration.json";
// Default lookup safety margin
export const DEFAULT_LOOKUP_SAFETY_MARGIN: string = "2";
// Default Compress selectors
export const DEFAULT_DISABLE_SELECTOR_COMPRESSION: boolean = false;
// Default render vk separately
export const DEFAULT_RENDER_VK_SEPARATELY: boolean = false;
// Default VK sol path
export const DEFAULT_VK_SOL: string = "vk.sol";
// Default VK abi path
export const DEFAULT_VK_ABI: string = "vk.abi";
// Default scale rebase multipliers for calibration
export const DEFAULT_SCALE_REBASE_MULTIPLIERS: string = "1,2,10";
// Default use reduced srs for verification
export const DEFAULT_USE_REDUCED_SRS_FOR_VERIFICATION: boolean = false;
// Default only check for range check rebase
export const DEFAULT_ONLY_RANGE_CHECK_REBASE: boolean = false;
// Default commitment
export const DEFAULT_COMMITMENT: string = "kzg";
