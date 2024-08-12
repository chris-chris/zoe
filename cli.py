import subprocess
import json

class ZoeCLI:
    def __init__(self, executable='zoe'):
        self.executable = executable

    def _run_command(self, command, *args):
        cmd = ['node', 'dist/index.js', command] + list(args)
        try:
            result = subprocess.run(cmd, capture_output=True, text=True, check=True)
            return result.stdout
        except subprocess.CalledProcessError as e:
            print(f"Command failed with exit code {e.returncode}")
            print(f"Error output: {e.stderr}")
            return None

    def gen_srs(self, srs_path, logrows, commitment=None):
        args = [srs_path, str(logrows)]
        if commitment:
            args.append(commitment)
        return self._run_command('gen-srs', *args)

    def get_srs(self, srs_path, settings_path, logrows, commitment=None):
        args = [srs_path, settings_path, str(logrows)]
        if commitment:
            args.append(commitment)
        return self._run_command('get-srs', *args)

    def table(self, model, *args):
        return self._run_command('table', model, *args)

    def gen_settings(self, model, settings_path, *args):
        return self._run_command('gen-settings', model, settings_path, *args)

    def calibrate_settings(self, model, settings_path, data, target, lookup_safety_margin, scales, scale_rebase_multiplier, max_logrows=None, only_range_check_rebase=None):
        args = [model, settings_path, data, target, str(lookup_safety_margin), str(scales), str(scale_rebase_multiplier)]
        if max_logrows:
            args.append(str(max_logrows))
        if only_range_check_rebase:
            args.append(str(only_range_check_rebase))
        return self._run_command('calibrate-settings', *args)

    def gen_witness(self, data, compiled_circuit, output, vk_path, srs_path):
        return self._run_command('gen-witness', data, compiled_circuit, output, vk_path, srs_path)

    def mock(self, model, witness):
        return self._run_command('mock', model, witness)

    def create_evm_verifier(self, srs_path, vk_path=None, settings_path=None, sol_code_path=None, abi_path=None, render_vk_separately=None):
        args = [srs_path]
        if vk_path:
            args.append(vk_path)
        if settings_path:
            args.append(settings_path)
        if sol_code_path:
            args.append(sol_code_path)
        if abi_path:
            args.append(abi_path)
        if render_vk_separately:
            args.append(render_vk_separately)
        return self._run_command('create-evm-verifier', *args)

    def encode_evm_calldata(self, addr_vk, proof_path=None, calldata_path=None):
        args = [addr_vk]
        if proof_path:
            args.append(proof_path)
        if calldata_path:
            args.append(calldata_path)
        return self._run_command('encode-evm-calldata', *args)

    def create_evm_vk(self, srs_path, vk_path=None, settings_path=None, sol_code_path=None, abi_path=None):
        args = [srs_path]
        if vk_path:
            args.append(vk_path)
        if settings_path:
            args.append(settings_path)
        if sol_code_path:
            args.append(sol_code_path)
        if abi_path:
            args.append(abi_path)
        return self._run_command('create-evm-vk', *args)

    def create_evm_data_attestation(self, witness, settings_path=None, sol_code_path=None, abi_path=None, data=None):
        args = [witness]
        if settings_path:
            args.append(settings_path)
        if sol_code_path:
            args.append(sol_code_path)
        if abi_path:
            args.append(abi_path)
        if data:
            args.append(data)
        return self._run_command('create-evm-data-attestation', *args)

    def create_evm_verifier_aggr(self, srs_path, aggregation_settings, vk_path=None, sol_code_path=None, abi_path=None, logrows=None, render_vk_separately=None):
        args = [srs_path, aggregation_settings]
        if vk_path:
            args.append(vk_path)
        if sol_code_path:
            args.append(sol_code_path)
        if abi_path:
            args.append(abi_path)
        if logrows:
            args.append(str(logrows))
        if render_vk_separately:
            args.append(render_vk_separately)
        return self._run_command('create-evm-verifier-aggr', *args)

    def compile_circuit(self, model, compiled_circuit=None, settings_path=None):
        args = [model]
        if compiled_circuit:
            args.append(compiled_circuit)
        if settings_path:
            args.append(settings_path)
        return self._run_command('compile-circuit', *args)

    def setup(self, srs_path, witness, compiled_circuit=None, vk_path=None, pk_path=None, disable_selector_compression=None):
        args = [srs_path, witness]
        if compiled_circuit:
            args.append(compiled_circuit)
        if vk_path:
            args.append(vk_path)
        if pk_path:
            args.append(pk_path)
        if disable_selector_compression:
            args.append(str(disable_selector_compression))
        return self._run_command('setup', *args)

if __name__ == "__main__":
    zoe = ZoeCLI()
    ret = zoe.gen_srs("1", 2, "3")
    print(ret)
