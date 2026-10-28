# The AI Agent Factory, Second Edition: Resources

The files you need for the hands-on parts of *The AI Agent Factory*, Second Edition. There is one folder for each lab. Every name, number and company in them is invented.

## Get a lab

Click the lab's link in the book. Your browser downloads a zip file. Unzip it and open its `README.md` first.

You can also download a lab here:

| Chapter | Lab | Download |
| --- | --- | --- |
| 1. From Chatbots to AI Workers | A real job, checked | [brightline-lab-ch01.zip](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch01.zip) |
| 2. What Is an AI Worker? | The first Role Contract | [brightline-lab-ch02.zip](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch02.zip) |
| 3. The 10-80-10 Operating Rhythm | The same one line | [brightline-lab-ch03.zip](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch03.zip) |
| 4. The Architecture in One Picture | Where each part lives | [brightline-lab-ch04.zip](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch04.zip) |
| 5. The Four-Part Brief | The payment-run brief | [brightline-lab-ch05.zip](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch05.zip) |
| 6. The Review Contract | The checks come first | [brightline-lab-ch06.zip](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch06.zip) |
| 7. The Authority Envelope | May, then can | [brightline-lab-ch07.zip](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch07.zip) |
| 8. Context, Memory, Knowledge and State | Where each answer comes from | [brightline-lab-ch08.zip](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch08.zip) |
| 9. Work That Runs Without You | When nobody is watching | [brightline-lab-ch09.zip](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch09.zip) |
| 10. Governance and Responsible Use | Yes, on these terms | [brightline-lab-ch10.zip](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch10.zip) |
| 11. When the Worker Goes Wrong | Where each failure lives | [brightline-lab-ch11.zip](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch11.zip) |

A lab's `answer-key/` folder holds its answers, and its `LAB.md` tells you when to open it. A lab whose learners upload files to an AI keeps its answer keys out of its zip: its `LAB.md` links one key per task from the latest release instead.

## How this repository works

Each folder in `labs/` is one lab. When a lab changes on `main`, a GitHub Action zips every lab folder and publishes the zips as a new release. Chapter 1's zip leaves out `answer-key/`, and holds its `inputs/` folder only as `inputs.zip`: the one file its learners give the AI. Code that makes a lab's files lives in `tools/`, outside every zip.

Chapter 1's first version, `labs/brightline-lab/`, stays until the book's Chapter 1 page links `brightline-lab-ch01.zip`. Then it is deleted, and its zip leaves the release. The book links to the latest release, so a link always downloads the newest copy.

To add a lab, add its folder under `labs/`, add a row to the table above, and push to `main`.

## License

Apache-2.0. See [LICENSE](LICENSE).
