import { useEffect, useState } from "react";
import { useSigner, useAccount, useContractWrite } from "wagmi";
import MLS_NFT_CONTRACT from "../../contracts/out/NFT.sol/NFT.json";
import { contract_address, metadata_url } from "../utils/consts";
import { Job } from "./jobcard";
let zeroAddress = "0x0000000000000000000000000000000000000000";

const ClaimButton = ({
  job
}: {
  job: Job
}) => {
  const [claimed, setClaimed] = useState(false);
  const [weClaimed, setWeClaimed] = useState(false);
  const { data: signer } = useSigner();
  const { data: account } = useAccount();

  const { write: claimToken } = useContractWrite(
    {
      addressOrName: contract_address,
      contractInterface: MLS_NFT_CONTRACT.abi,
      signerOrProvider: signer,
    },
    "claimJob",
    {
      onSettled(data, error) {
        console.log("Settled", data, error);
      },
    }
  );

  const { write: unClaimToken } = useContractWrite(
    {
      addressOrName: contract_address,
      contractInterface: MLS_NFT_CONTRACT.abi,
      signerOrProvider: signer,
    },
    "unClaimJob",
    {
      onSettled(data, error) {
        console.log("Settled", data, error);
      },
    }
  );

  const claim = async () => {
    if (account) {
      await claimToken({
        args: [
          job.tokenID,
          account?.address, //recruiter
          account?.address, //executer
        ],
      });
    } else {
      console.log("No account for claim");
    }
  };

  const unClaim = async () => {
    await unClaimToken({
      args: [job.tokenID],
    });
  };

  useEffect(() => {
    if (job.claimer !== zeroAddress) {
      setClaimed(true);
      if (job.claimer === account?.address) {
        setWeClaimed(true);
      }
    }
  }, []);

  return (
    <>
      {claimed ? (
        <>
          {weClaimed ? (
            <button onClick={unClaim} className="btn btn-accent">
              Unclaim
            </button>
          ) : (
            <div className="bg-base-200 text-base rounded-md shadow-xl px-4">
              <div> Claimed By:</div>
              {job.claimer.substring(0, 7)}...
            </div>
          )}
        </>
      ) : (
        <button onClick={claim} className="btn btn-primary">
          Claim Job
        </button>
      )}
    </>
  );
};

export default ClaimButton;
