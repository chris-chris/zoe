"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gen_srs_cmd = gen_srs_cmd;
exports.get_srs_cmd = get_srs_cmd;
exports.table = table;
exports.gen_circuit_settings = gen_circuit_settings;
exports.calibrate = calibrate;
exports.gen_witness = gen_witness;
exports.mock = mock;
exports.create_evm_verifier = create_evm_verifier;
exports.encode_evm_calldata = encode_evm_calldata;
exports.create_evm_vk = create_evm_vk;
exports.create_evm_data_attestation = create_evm_data_attestation;
exports.create_evm_aggregate_verifier = create_evm_aggregate_verifier;
exports.compile_circuit = compile_circuit;
exports.setup = setup;
/// Generates the Structured Reference String (SRS), use this only for testing purposes
///
/// Arguments
/// ---------
/// srs_path: str
///     Path to the create the SRS file
///
/// logrows: int
///     The number of logrows for the SRS file
///
function gen_srs_cmd(srs_path, logrows, commitment) {
    console.log(`Generating SRS with path: ${srs_path}, logrows: ${logrows}, commitment: ${commitment}`);
    // Implementation here...
}
async function get_srs_cmd(srs_path, settings_path, logrows, commitment) {
    console.log(`Getting SRS with path: ${srs_path}, settings: ${settings_path}, logrows: ${logrows}, commitment: ${commitment}`);
    // Implementation here...
}
function table(model, args) {
    console.log(`Generating table with model: ${model}, args: ${args}`);
    // Implementation here...
}
async function gen_circuit_settings(model, settings_path, args) {
    console.log(`Generating circuit settings with model: ${model}, settings path: ${settings_path}, args: ${args}`);
    // Implementation here...
}
async function calibrate(model, data, settings_path, target, lookup_safety_margin, scales, scale_rebase_multiplier, only_range_check_rebase, max_logrows) {
    console.log(`Calibrating with model: ${model}, data: ${data}, settings path: ${settings_path}, target: ${target}`);
    // Implementation here...
    return {}; // Example return
}
async function gen_witness(compiled_circuit, data, output, vk_path, srs_path) {
    console.log(`Generating witness with compiled circuit: ${compiled_circuit}, data: ${data}, output: ${output}`);
    // Implementation here...
    return {}; // Example return
}
function mock(model, witness) {
    console.log(`Mocking with model: ${model}, witness: ${witness}`);
    // Implementation here...
}
// Example function implementations for handling commands
async function create_evm_verifier(vk_path, srs_path, settings_path, sol_code_path, abi_path, render_vk_separately) {
    console.log(`Creating EVM verifier with vk_path: ${vk_path}, srs_path: ${srs_path}, settings_path: ${settings_path}, sol_code_path: ${sol_code_path}, abi_path: ${abi_path}, render_vk_separately: ${render_vk_separately}`);
    // Implementation here...
}
function encode_evm_calldata(proof_path, calldata_path, addr_vk) {
    console.log(`Encoding EVM calldata with proof_path: ${proof_path}, calldata_path: ${calldata_path}, addr_vk: ${addr_vk}`);
    // Implementation here...
    return {}; // Example return value
}
async function create_evm_vk(vk_path, srs_path, settings_path, sol_code_path, abi_path) {
    console.log(`Creating EVM VK with vk_path: ${vk_path}, srs_path: ${srs_path}, settings_path: ${settings_path}, sol_code_path: ${sol_code_path}, abi_path: ${abi_path}`);
    // Implementation here...
}
async function create_evm_data_attestation(settings_path, sol_code_path, abi_path, data, witness) {
    console.log(`Creating EVM Data Attestation with settings_path: ${settings_path}, sol_code_path: ${sol_code_path}, abi_path: ${abi_path}, data: ${data}, witness: ${witness}`);
    // Implementation here...
}
async function create_evm_aggregate_verifier(vk_path, srs_path, sol_code_path, abi_path, aggregation_settings, logrows, render_vk_separately) {
    console.log(`Creating Aggregated EVM Verifier with vk_path: ${vk_path}, srs_path: ${srs_path}, sol_code_path: ${sol_code_path}, abi_path: ${abi_path}, aggregation_settings: ${aggregation_settings}, logrows: ${logrows}, render_vk_separately: ${render_vk_separately}`);
    // Implementation here...
}
function compile_circuit(model, compiled_circuit, settings_path) {
    console.log(`Compiling circuit with model: ${model}, compiled_circuit: ${compiled_circuit}, settings_path: ${settings_path}`);
    // Implementation here...
}
function setup(compiled_circuit, srs_path, vk_path, pk_path, witness, disable_selector_compression) {
    console.log(`Setting up circuit with compiled_circuit: ${compiled_circuit}, srs_path: ${srs_path}, vk_path: ${vk_path}, pk_path: ${pk_path}, witness: ${witness}, disable_selector_compression: ${disable_selector_compression}`);
    // Implementation here...
}
