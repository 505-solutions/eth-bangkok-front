import { useEffect, useState } from 'react';
import lighthouse from '@lighthouse-web3/sdk';
import {
  Button,
  FileInput,
  Progress,
  Stack,
  Code,
  List,
  ListItem,
  ThemeIcon,
  Text,
} from '@mantine/core';
import { IconFile } from '@tabler/icons-react';

function FilecoinUpload({setFiles, close}) {
  const [value, setValue] = useState<File[]>([]);
  const [currentUpload, setCurrentUpload] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [output, setOutput] = useState<any>([]);
  const [priceEstimate, setPriceEstimate] = useState<BigInt>(BigInt(0));
  const [apiToken, setApiToken] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [stepIndex, setStepIndex] = useState<number>(0);

  const steps = [
    'Select files and click "Upload"',
    'Pay and wait for Filecoin storage provisioning...',
    'Sign message to verify wallet ownership...',
    'Uploading to Filecoin...',
    'Upload complete ✅',
  ];

  const estimatePrice = async () => {
    let price = await lighthouse.getPrice(value, 'calibration', 'usdc');
    console.log(price);
    const regex = /\d+/g;
    const numericPart = price.toString().match(regex)?.join('');
    console.log(numericPart);
    setPriceEstimate(BigInt(numericPart!) / BigInt('1000000000000000'));
  };

  useEffect(() => {
    if (value.length > 0) {
      estimatePrice();
    }
  }, [value]);

  const progressCallback = (progressData: any) => {
    let percentageDone = 100 - ((progressData?.total / progressData?.uploaded) as any)?.toFixed(2);
    console.log(percentageDone);
    setProgress(percentageDone);
  };

  const uploadFile = async (file: any) => {
    try {
      setLoading(true);
      setStepIndex(1);
      let fil_price: bigint = await lighthouse.getPrice(value, 'calibration', 'native');
      let tx = await lighthouse.fund(fil_price, 'calibration', 'native');
      setStepIndex(2);
      let authToken = await lighthouse.oneTimeAuth();
      setApiToken(authToken);
      setStepIndex(3);
      console.log(tx);
      console.log(file);
      // Push file to lighthouse node
      // Both file and folder are supported by upload function
      // Third parameter is for multiple files, if multiple files are to be uploaded at once make it true
      // Fourth parameter is the deal parameters, default null
      //authToken = "4414e711.bdd4d86b458941e98806bcfbb1f7d396";
      const output = await lighthouse.upload(file, authToken, true, undefined, progressCallback);
      setOutput(output);
      console.log('File Status:', output);
      setFiles(output.data);
      close();
      setProgress(100);
      setStepIndex(4);
      setLoading(false);
      const response = await lighthouse.getUploads(authToken);
      console.log('lighthouse response',response);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
    /*
      output:
        data: {
          Name: "filename.txt",
          Size: 88000,
          Hash: "QmWNmn2gr4ZihNPqaC5oTeePsHvFtkWNpjY3cD6Fd5am1w"
        }
      Note: Hash in response is CID.
    */
  };
  const done = progress === 100;
  return (
    <div className="App" style={{ maxWidth: 600, margin: 'auto', paddingTop: 50 }}>
      <Stack>
        <FileInput
          label="Upload files"
          placeholder="Upload files"
          onChange={(e) => setValue(e)}
          multiple
        />
        {!done ? <Progress transitionDuration={500} value={progress} /> : ''}

        <Button loading={loading} onClick={() => uploadFile(value)} disabled={progress !== 0}>
          {!done ? 'Upload' : 'Upload complete'}
        </Button>
        {
          <Text style={{ textAlign: 'center' }}>
            <b>{steps[stepIndex]}</b>
            <br></br>
            <small>Estimated cost: ~{Number(priceEstimate) / 1000} USDC</small>
          </Text>
        }
        {output && output.data && (
          <List spacing="xs" size="sm" center icon={<IconFile />}>
            {output.data.map((file: any, index: number) => (
              <ListItem key={index}>
                <Code>
                  <b>{file.Name || '< Parent folder >'}</b>
                </Code>{' '}
                -{' '}
                <Code>
                  {file.Hash} |{' '}
                  <a
                    href={`https://gateway.lighthouse.storage/ipfs/${file.Hash}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    IPFS ↗
                  </a>{' '}
                </Code>
              </ListItem>
            ))}
          </List>
        )}
      </Stack>
    </div>
  );
}

export default FilecoinUpload;