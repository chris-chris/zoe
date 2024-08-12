#! /usr/bin/env node

import assert from "assert";
import {
    DEFAULT_DATA,
    DEFAULT_MODEL,
    DEFAULT_COMPILED_CIRCUIT,
    DEFAULT_WITNESS,
    DEFAULT_SETTINGS,
    DEFAULT_PK,
    DEFAULT_VK,
    DEFAULT_PK_AGGREGATED,
    DEFAULT_VK_AGGREGATED,
    DEFAULT_PROOF,
    DEFAULT_PROOF_AGGREGATED,
    DEFAULT_SPLIT,
    DEFAULT_VERIFIER_ABI,
    DEFAULT_VERIFIER_AGGREGATED_ABI,
    DEFAULT_VERIFIER_DA_ABI,
    DEFAULT_SOL_CODE,
    DEFAULT_CALLDATA,
    DEFAULT_SOL_CODE_AGGREGATED,
    DEFAULT_SOL_CODE_DA,
    DEFAULT_CONTRACT_ADDRESS,
    DEFAULT_CONTRACT_ADDRESS_DA,
    DEFAULT_CONTRACT_ADDRESS_VK,
    DEFAULT_CHECKMODE,
    DEFAULT_CALIBRATION_TARGET,
    DEFAULT_AGGREGATED_LOGROWS,
    DEFAULT_OPTIMIZER_RUNS,
    DEFAULT_FUZZ_RUNS,
    DEFAULT_CALIBRATION_FILE,
    DEFAULT_LOOKUP_SAFETY_MARGIN,
    DEFAULT_DISABLE_SELECTOR_COMPRESSION,
    DEFAULT_RENDER_VK_SEPARATELY,
    DEFAULT_VK_SOL,
    DEFAULT_VK_ABI,
    DEFAULT_SCALE_REBASE_MULTIPLIERS,
    DEFAULT_USE_REDUCED_SRS_FOR_VERIFICATION,
    DEFAULT_ONLY_RANGE_CHECK_REBASE,
    DEFAULT_COMMITMENT
  } from './default';

  import {
    gen_srs_cmd,
    get_srs_cmd,
    table,
    gen_circuit_settings,
    calibrate,
    gen_witness,
    mock,
    create_evm_verifier,
    encode_evm_calldata,
    create_evm_vk,
    create_evm_data_attestation,
    create_evm_aggregate_verifier,
    compile_circuit,
    setup
  } from './execute';

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
  .action((srs_path: string, logrows: string, commitment?: string) => {
    gen_srs_cmd(
      srs_path,
      parseInt(logrows),
      commitment || DEFAULT_COMMITMENT
    );
  });

// Define the 'get-srs' command
program
  .command('get-srs <srs_path> <settings_path> <logrows> [commitment]')
  .description('Get SRS based on settings')
  .action(async (srs_path: string, settings_path: string, logrows: string, commitment?: string) => {
    await get_srs_cmd(
      srs_path,
      settings_path,
      parseInt(logrows),
      commitment
    );
  });

// Define the 'table' command
program
  .command('table <model> [args...]')
  .description('Generate a table based on the model and arguments')
  .action((model: string, args: string[]) => {
    table(
      model || DEFAULT_MODEL,
      args
    );
  });

// Define the 'gen-settings' command
program
  .command('gen-settings <model> <settings_path> [args...]')
  .description('Generate circuit settings')
  .action((model: string, settings_path: string, args: string[]) => {
    gen_circuit_settings(
      model || DEFAULT_MODEL,
      settings_path || DEFAULT_SETTINGS,
      args
    );
  });

// Define the 'calibrate-settings' command
program
  .command('calibrate-settings <model> <settings_path> <data> <target> <lookup_safety_margin> <scales> <scale_rebase_multiplier> [max_logrows] [only_range_check_rebase]')
  .description('Calibrate circuit settings')
  .action(async (
    model: string,
    settings_path: string,
    data: string,
    target: string,
    lookup_safety_margin: number,
    scales: number,
    scale_rebase_multiplier: number,
    max_logrows?: number,
    only_range_check_rebase?: boolean
  ) => {
    const result = await calibrate(
      model || DEFAULT_MODEL,
      data || DEFAULT_DATA,
      settings_path || DEFAULT_SETTINGS,
      target,
      lookup_safety_margin,
      scales,
      scale_rebase_multiplier,
      only_range_check_rebase ?? DEFAULT_ONLY_RANGE_CHECK_REBASE,
      max_logrows
    );
    console.log(JSON.stringify(result));
  });

// Define the 'gen-witness' command
program
  .command('gen-witness <data> <compiled_circuit> <output> <vk_path> <srs_path>')
  .description('Generate witness')
  .action(async (
    data: string,
    compiled_circuit: string,
    output: string,
    vk_path: string,
    srs_path: string
  ) => {
    const result = await gen_witness(
      compiled_circuit || DEFAULT_COMPILED_CIRCUIT,
      data || DEFAULT_DATA,
      output || DEFAULT_WITNESS,
      vk_path,
      srs_path
    );
    console.log(JSON.stringify(result));
  });

// Define the 'mock' command
program
  .command('mock <model> <witness>')
  .description('Mock execution based on the model and witness')
  .action((model: string, witness: string) => {
    mock(
      model || DEFAULT_MODEL,
      witness || DEFAULT_WITNESS
    );
  });
  // Define the 'create-evm-verifier' command
program
.command('create-evm-verifier <srs_path> [vk_path] [settings_path] [sol_code_path] [abi_path] [render_vk_separately]')
.description('Create an EVM verifier')
.action(async (
  srs_path: string,
  vk_path?: string,
  settings_path?: string,
  sol_code_path?: string,
  abi_path?: string,
  render_vk_separately?: boolean
) => {
  await create_evm_verifier(
    vk_path || DEFAULT_VK,
    srs_path,
    settings_path || DEFAULT_SETTINGS,
    sol_code_path || DEFAULT_SOL_CODE,
    abi_path || DEFAULT_VERIFIER_ABI,
    render_vk_separately ?? DEFAULT_RENDER_VK_SEPARATELY
  );
});

// Define the 'encode-evm-calldata' command
program
.command('encode-evm-calldata <addr_vk> [proof_path] [calldata_path]')
.description('Encode EVM calldata')
.action((addr_vk: string, proof_path?: string, calldata_path?: string) => {
  const result = encode_evm_calldata(
    proof_path || DEFAULT_PROOF,
    calldata_path || DEFAULT_CALLDATA,
    addr_vk
  );
  console.log(JSON.stringify(result));
});

// Define the 'create-evm-vk' command
program
.command('create-evm-vk <srs_path> [vk_path] [settings_path] [sol_code_path] [abi_path]')
.description('Create EVM verification key')
.action(async (
  srs_path: string,
  vk_path?: string,
  settings_path?: string,
  sol_code_path?: string,
  abi_path?: string
) => {
  await create_evm_vk(
    vk_path || DEFAULT_VK,
    srs_path,
    settings_path || DEFAULT_SETTINGS,
    sol_code_path || DEFAULT_VK_SOL,
    abi_path || DEFAULT_VK_ABI
  );
});

// Define the 'create-evm-data-attestation' command
program
.command('create-evm-data-attestation <witness> [settings_path] [sol_code_path] [abi_path] [data]')
.description('Create EVM data attestation')
.action(async (
  witness: string,
  settings_path?: string,
  sol_code_path?: string,
  abi_path?: string,
  data?: string
) => {
  await create_evm_data_attestation(
    settings_path || DEFAULT_SETTINGS,
    sol_code_path || DEFAULT_SOL_CODE_DA,
    abi_path || DEFAULT_VERIFIER_DA_ABI,
    data || DEFAULT_DATA,
    witness
  );
});

// Define the 'create-evm-verifier-aggr' command
program
.command('create-evm-verifier-aggr <srs_path> <aggregation_settings> [vk_path] [sol_code_path] [abi_path] [logrows] [render_vk_separately]')
.description('Create an aggregated EVM verifier')
.action(async (
  srs_path: string,
  aggregation_settings: string,
  vk_path?: string,
  sol_code_path?: string,
  abi_path?: string,
  logrows?: string,
  render_vk_separately?: boolean
) => {
  await create_evm_aggregate_verifier(
    vk_path || DEFAULT_VK,
    srs_path,
    sol_code_path || DEFAULT_SOL_CODE_AGGREGATED,
    abi_path || DEFAULT_VERIFIER_AGGREGATED_ABI,
    aggregation_settings,
    logrows ? parseInt(logrows) : DEFAULT_AGGREGATED_LOGROWS,
    render_vk_separately ?? DEFAULT_RENDER_VK_SEPARATELY
  );
});

// Define the 'compile-circuit' command
program
.command('compile-circuit <model> [compiled_circuit] [settings_path]')
.description('Compile a circuit')
.action((model: string, compiled_circuit?: string, settings_path?: string) => {
  compile_circuit(
    model || DEFAULT_MODEL,
    compiled_circuit || DEFAULT_COMPILED_CIRCUIT,
    settings_path || DEFAULT_SETTINGS
  );
});

// Define the 'setup' command
program
.command('setup <srs_path> <witness> [compiled_circuit] [vk_path] [pk_path] [disable_selector_compression]')
.description('Setup the circuit')
.action((
  srs_path: string,
  witness: string,
  compiled_circuit?: string,
  vk_path?: string,
  pk_path?: string,
  disable_selector_compression?: boolean
) => {
  setup(
    compiled_circuit || DEFAULT_COMPILED_CIRCUIT,
    srs_path,
    vk_path || DEFAULT_VK,
    pk_path || DEFAULT_PK,
    witness,
    disable_selector_compression ?? DEFAULT_DISABLE_SELECTOR_COMPRESSION
  );
});


program.parse(process.argv);

const options = program.opts();

if (!process.argv.slice(2).length) {
    program.outputHelp();
}
