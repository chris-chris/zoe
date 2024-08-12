#! /usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const default_1 = require("./default");
const execute_1 = require("./execute");
const fs = require("fs");
const path = require("path");
const { Command } = require("commander"); // add this line
const figlet = require("figlet");
const program = new Command();
console.log(figlet.textSync("ZOE: ZKML Optimization Engine"));
program
    .version("1.0.0")
    .description("ZOE: ZKML Optimization Engine");
// Define the 'gen-srs' command
program
    .command('gen-srs <srs_path> <logrows> [commitment]')
    .description('Generate SRS (Structured Reference String)')
    .action((srs_path, logrows, commitment) => {
    (0, execute_1.gen_srs_cmd)(srs_path, parseInt(logrows), commitment || default_1.DEFAULT_COMMITMENT);
});
// Define the 'get-srs' command
program
    .command('get-srs <srs_path> <settings_path> <logrows> [commitment]')
    .description('Get SRS based on settings')
    .action((srs_path, settings_path, logrows, commitment) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, execute_1.get_srs_cmd)(srs_path, settings_path, parseInt(logrows), commitment);
}));
// Define the 'table' command
program
    .command('table <model> [args...]')
    .description('Generate a table based on the model and arguments')
    .action((model, args) => {
    (0, execute_1.table)(model || default_1.DEFAULT_MODEL, args);
});
// Define the 'gen-settings' command
program
    .command('gen-settings <model> <settings_path> [args...]')
    .description('Generate circuit settings')
    .action((model, settings_path, args) => {
    (0, execute_1.gen_circuit_settings)(model || default_1.DEFAULT_MODEL, settings_path || default_1.DEFAULT_SETTINGS, args);
});
// Define the 'calibrate-settings' command
program
    .command('calibrate-settings <model> <settings_path> <data> <target> <lookup_safety_margin> <scales> <scale_rebase_multiplier> [max_logrows] [only_range_check_rebase]')
    .description('Calibrate circuit settings')
    .action((model, settings_path, data, target, lookup_safety_margin, scales, scale_rebase_multiplier, max_logrows, only_range_check_rebase) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, execute_1.calibrate)(model || default_1.DEFAULT_MODEL, data || default_1.DEFAULT_DATA, settings_path || default_1.DEFAULT_SETTINGS, target, lookup_safety_margin, scales, scale_rebase_multiplier, only_range_check_rebase !== null && only_range_check_rebase !== void 0 ? only_range_check_rebase : default_1.DEFAULT_ONLY_RANGE_CHECK_REBASE, max_logrows);
    console.log(JSON.stringify(result));
}));
// Define the 'gen-witness' command
program
    .command('gen-witness <data> <compiled_circuit> <output> <vk_path> <srs_path>')
    .description('Generate witness')
    .action((data, compiled_circuit, output, vk_path, srs_path) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, execute_1.gen_witness)(compiled_circuit || default_1.DEFAULT_COMPILED_CIRCUIT, data || default_1.DEFAULT_DATA, output || default_1.DEFAULT_WITNESS, vk_path, srs_path);
    console.log(JSON.stringify(result));
}));
// Define the 'mock' command
program
    .command('mock <model> <witness>')
    .description('Mock execution based on the model and witness')
    .action((model, witness) => {
    (0, execute_1.mock)(model || default_1.DEFAULT_MODEL, witness || default_1.DEFAULT_WITNESS);
});
// Define the 'create-evm-verifier' command
program
    .command('create-evm-verifier <srs_path> [vk_path] [settings_path] [sol_code_path] [abi_path] [render_vk_separately]')
    .description('Create an EVM verifier')
    .action((srs_path, vk_path, settings_path, sol_code_path, abi_path, render_vk_separately) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, execute_1.create_evm_verifier)(vk_path || default_1.DEFAULT_VK, srs_path, settings_path || default_1.DEFAULT_SETTINGS, sol_code_path || default_1.DEFAULT_SOL_CODE, abi_path || default_1.DEFAULT_VERIFIER_ABI, render_vk_separately !== null && render_vk_separately !== void 0 ? render_vk_separately : default_1.DEFAULT_RENDER_VK_SEPARATELY);
}));
// Define the 'encode-evm-calldata' command
program
    .command('encode-evm-calldata <addr_vk> [proof_path] [calldata_path]')
    .description('Encode EVM calldata')
    .action((addr_vk, proof_path, calldata_path) => {
    const result = (0, execute_1.encode_evm_calldata)(proof_path || default_1.DEFAULT_PROOF, calldata_path || default_1.DEFAULT_CALLDATA, addr_vk);
    console.log(JSON.stringify(result));
});
// Define the 'create-evm-vk' command
program
    .command('create-evm-vk <srs_path> [vk_path] [settings_path] [sol_code_path] [abi_path]')
    .description('Create EVM verification key')
    .action((srs_path, vk_path, settings_path, sol_code_path, abi_path) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, execute_1.create_evm_vk)(vk_path || default_1.DEFAULT_VK, srs_path, settings_path || default_1.DEFAULT_SETTINGS, sol_code_path || default_1.DEFAULT_VK_SOL, abi_path || default_1.DEFAULT_VK_ABI);
}));
// Define the 'create-evm-data-attestation' command
program
    .command('create-evm-data-attestation <witness> [settings_path] [sol_code_path] [abi_path] [data]')
    .description('Create EVM data attestation')
    .action((witness, settings_path, sol_code_path, abi_path, data) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, execute_1.create_evm_data_attestation)(settings_path || default_1.DEFAULT_SETTINGS, sol_code_path || default_1.DEFAULT_SOL_CODE_DA, abi_path || default_1.DEFAULT_VERIFIER_DA_ABI, data || default_1.DEFAULT_DATA, witness);
}));
// Define the 'create-evm-verifier-aggr' command
program
    .command('create-evm-verifier-aggr <srs_path> <aggregation_settings> [vk_path] [sol_code_path] [abi_path] [logrows] [render_vk_separately]')
    .description('Create an aggregated EVM verifier')
    .action((srs_path, aggregation_settings, vk_path, sol_code_path, abi_path, logrows, render_vk_separately) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, execute_1.create_evm_aggregate_verifier)(vk_path || default_1.DEFAULT_VK, srs_path, sol_code_path || default_1.DEFAULT_SOL_CODE_AGGREGATED, abi_path || default_1.DEFAULT_VERIFIER_AGGREGATED_ABI, aggregation_settings, logrows ? parseInt(logrows) : default_1.DEFAULT_AGGREGATED_LOGROWS, render_vk_separately !== null && render_vk_separately !== void 0 ? render_vk_separately : default_1.DEFAULT_RENDER_VK_SEPARATELY);
}));
// Define the 'compile-circuit' command
program
    .command('compile-circuit <model> [compiled_circuit] [settings_path]')
    .description('Compile a circuit')
    .action((model, compiled_circuit, settings_path) => {
    (0, execute_1.compile_circuit)(model || default_1.DEFAULT_MODEL, compiled_circuit || default_1.DEFAULT_COMPILED_CIRCUIT, settings_path || default_1.DEFAULT_SETTINGS);
});
// Define the 'setup' command
program
    .command('setup <srs_path> <witness> [compiled_circuit] [vk_path] [pk_path] [disable_selector_compression]')
    .description('Setup the circuit')
    .action((srs_path, witness, compiled_circuit, vk_path, pk_path, disable_selector_compression) => {
    (0, execute_1.setup)(compiled_circuit || default_1.DEFAULT_COMPILED_CIRCUIT, srs_path, vk_path || default_1.DEFAULT_VK, pk_path || default_1.DEFAULT_PK, witness, disable_selector_compression !== null && disable_selector_compression !== void 0 ? disable_selector_compression : default_1.DEFAULT_DISABLE_SELECTOR_COMPRESSION);
});
program.parse(process.argv);
const options = program.opts();
if (!process.argv.slice(2).length) {
    program.outputHelp();
}
//# sourceMappingURL=index.js.map