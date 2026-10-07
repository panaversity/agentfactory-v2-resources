# The AI Agent Factory, Second Edition: Resources

The files you need for the hands-on parts of *The AI Agent Factory*, Second Edition. There is one folder for each lab. Every name, number and company in them is invented.

## Get a lab

Click the lab's link in the book. Your browser downloads a zip file. For Chapter 1, the zip holds only the lab's data, and the tasks are on the book page. For the other chapters, unzip it and open its `README.md` first.

You can also download a lab here:

| Chapter | Lab | Download |
| --- | --- | --- |
| 1. From Chatbots to AI Workers | One portable brief, two runtimes | [brightline-lab-ch01.zip](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch01.zip) |
| 2. What Is an AI Worker? | The first Role Contract for the AP Worker | [brightline-lab-ch02.zip](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch02.zip) |
| 3. The 10-80-10 Operating Rhythm | One task through the whole rhythm | [brightline-lab-ch03.zip](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch03.zip) |
| 4. The Architecture in One Picture | Map the AP Worker onto the picture | [brightline-lab-ch04.zip](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch04.zip) |
| 5. The Four-Part Brief | One brief, two AI vendors | [brightline-lab-ch05.zip](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch05.zip) |

Chapter 1's answers are in [`labs/brightline-lab-ch01/answers.md`](labs/brightline-lab-ch01/answers.md), which the book page links to last. For the other chapters, a lab's `answer-key/` folder holds its answers, and its `LAB.md` tells you when to open it.

## How this repository works

Each folder in `labs/` is one lab. When a lab changes on `main`, a GitHub Action zips every lab folder and publishes the zips as a new release. A lab with a `data/` folder, such as Chapter 1's, is zipped from that folder only, so its answers and sources stay out of the download.

Chapter 1's first version, `labs/brightline-lab/`, stays until the book's Chapter 1 page links `brightline-lab-ch01.zip`. Then it is deleted, and its zip leaves the release. The book links to the latest release, so a link always downloads the newest copy.

To add a lab, add its folder under `labs/`, add a row to the table above, and push to `main`.

## License

Apache-2.0. See [LICENSE](LICENSE).
