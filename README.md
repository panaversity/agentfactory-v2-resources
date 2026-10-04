# The AI Agent Factory, Second Edition: Resources

The files you need for the hands-on parts of *The AI Agent Factory*, Second Edition. There is one folder for each lab. Every name, number and company in them is invented.

## Get a lab

Click the lab's link in the book. Your browser downloads a zip file. Unzip it, and open its `README.md` first.

You can also download a lab here:

| Chapter | Lab | Download |
| --- | --- | --- |
| 1. From Chatbots to AI Workers | One portable brief, two runtimes | [brightline-lab.zip](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab.zip) |
| 2. What Is an AI Worker? | The first Role Contract for the AP Worker | [brightline-lab-ch02.zip](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch02.zip) |
| 3. The 10-80-10 Operating Rhythm | One task through the whole rhythm | [brightline-lab-ch03.zip](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch03.zip) |

A lab's `answer-key/` folder holds its answers. Its `LAB.md` tells you when to open it.

## How this repository works

Each folder in `labs/` is one lab. When a lab changes on `main`, a GitHub Action zips every lab folder and publishes the zips as a new release. The book links to the latest release, so a link always downloads the newest copy.

To add a lab, add its folder under `labs/`, add a row to the table above, and push to `main`.

## License

Apache-2.0. See [LICENSE](LICENSE).
