import { FormEvent, useState } from "react";
import { useSigner, useAccount, useBlockNumber, useContractWrite } from "wagmi";
import { contract_address, metadata_url } from "../utils/consts";
import MLS_NFT_CONTRACT from "../../contracts/out/NFT.sol/NFT.json";
import { BigNumber } from "ethers";
import { formatUnits, parseUnits } from "ethers/lib/utils";

type FormInput = {
  metadata: string;
  executer: string;
  creator: string;
  recruiter: string;
};

const MintForm = () => {
  let [form, setForm] = useState<FormInput>({
    metadata: metadata_url,
    executer: "0.1",
    creator: "0.005",
    recruiter: "0.005",
  });

  let [loading, setLoading] = useState(false);

  const blockNumber = useBlockNumber({
    watch: true,
  });

  const { data: signer } = useSigner();
  const { data: account } = useAccount();

  const { data, isError, isLoading, write } = useContractWrite(
    {
      addressOrName: contract_address,
      contractInterface: MLS_NFT_CONTRACT.abi,
      signerOrProvider: signer,
    },
    "mintTo",
    {
      onSettled(data, error) {
        console.log("Settled", { data, error });
      },
      onSuccess(data) {
        console.log("Success!", data);
      },
    }
  );

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    console.log("Submit?");
    try {
      e.preventDefault();
      setLoading(true);

      if (
        form.executer &&
        form.creator &&
        form.metadata &&
        form.recruiter &&
        blockNumber.data
      ) {
        //MINT!

        if (signer && account) {
          console.log("Minting");
          let deadline = blockNumber.data + 100;
          console.log("deadline" + deadline);

          let ethExec = parseUnits(form.executer);
          let ethCreator = parseUnits(form.creator);
          let ethRecruiter = parseUnits(form.recruiter);

          console.log("ethExec", ethExec);
          console.log("ethCreator", ethCreator);
          console.log("ethRecruiter", ethRecruiter);

          let totalValue = BigNumber.from(ethExec)
            .add(BigNumber.from(ethCreator))
            .add(BigNumber.from(ethRecruiter));

          await write({
            args: [
              account.address, //creator
              account.address, //receiver
              form.metadata,
              ethExec,
              ethRecruiter,
              ethCreator,
              deadline,
            ],
            overrides: { value: totalValue },
          });
        } else {
          console.log("No account or signer.");
        }
      } else {
        alert("Please fill in all fields");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-5 md:mt-0 md:col-span-2">
      <form action="#" onSubmit={submit} method="POST">
        <div className="shadow sm:rounded-md sm:overflow-hidden">
          <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
            {/* Metadata url */}
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700"
              >
                Token URI
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="text"
                  name="metadata"
                  id="metadata"
                  onChange={(e) =>
                    setForm({ ...form, metadata: e.target.value })
                  }
                  value={form.metadata}
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-12 sm:text-sm border-gray-300 rounded-md text-black"
                  aria-describedby="price-currency"
                />
              </div>
            </div>
            {/* Incentive 1 */}
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700"
              >
                Executer Payout
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="number"
                  name="executer"
                  id="executer"
                  onChange={(e) =>
                    setForm({ ...form, executer: e.target.value })
                  }
                  value={form.executer}
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-12 sm:text-sm border-gray-300 rounded-md text-black"
                  aria-describedby="price-currency"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span
                    className="text-gray-500 sm:text-sm"
                    id="price-currency"
                  >
                    ETH
                  </span>
                </div>
              </div>
            </div>
            {/* End Incentive 1 */}
            {/* Incentive 2 */}
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700"
              >
                Recruiter Payout
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="number"
                  name="recruiter"
                  id="recruiter"
                  onChange={(e) =>
                    setForm({ ...form, recruiter: e.target.value })
                  }
                  value={form.recruiter}
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-12 sm:text-sm border-gray-300 rounded-md text-black"
                  aria-describedby="price-currency"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span
                    className="text-gray-500 sm:text-sm"
                    id="price-currency"
                  >
                    ETH
                  </span>
                </div>
              </div>
            </div>
            {/* End Incentive 2 */}
            {/* Incentive 3 */}
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700"
              >
                Creator Payout
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="number"
                  name="creator"
                  id="creator"
                  onChange={(e) =>
                    setForm({ ...form, creator: e.target.value })
                  }
                  value={form.creator}
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-12 sm:text-sm border-gray-300 rounded-md text-black"
                  aria-describedby="price-currency"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span
                    className="text-gray-500 sm:text-sm"
                    id="price-currency"
                  >
                    ETH
                  </span>
                </div>
              </div>
            </div>
            {/* End Incentive 3 */}
            {/* <div>
              <label
                htmlFor="about"
                className="block text-sm font-medium text-gray-700"
              >
                About
              </label>
              <div className="mt-1">
                <textarea
                  id="about"
                  name="about"
                  rows={3}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                  placeholder="you@example.com"
                  defaultValue={""}
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Brief description for your profile. URLs are hyperlinked.
              </p>
            </div> */}

            {/* <div>
              <label className="block text-sm font-medium text-gray-700">
                Photo
              </label>
              <div className="mt-1 flex items-center">
                <span className="inline-block h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                  <svg
                    className="h-full w-full text-gray-300"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </span>
                <button
                  type="button"
                  className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Change
                </button>
              </div>
            </div> */}

            {/* <div>
              <label className="block text-sm font-medium text-gray-700">
                Cover photo
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>
            </div> */}
          </div>
          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
            <button
              disabled={loading}
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-pink-400"
            >
              Save
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default MintForm;
