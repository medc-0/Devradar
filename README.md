# DevRadar CLI

![npm](https://img.shields.io/npm/v/devradar-cli) ![license](https://img.shields.io/npm/l/devradar-cli) ![downloads](https://img.shields.io/npm/dt/devradar-cli)

**DevRadar** is a **developer project scanner CLI** that analyzes your local coding projects, reporting:

- Languages used and their percentage  
- Lines of code per project  
- Last Git commit date  
- Optional **JSON** or **HTML** report export  

Perfect for tracking your coding activity and generating stats for your portfolio.

---

## Features

- Scan multiple projects in a folder  
- Detect programming languages and line counts  
- Show last Git commit per project  
- Export JSON or **beautifully styled HTML** reports  
- Fully offline – no external API required  
- Lightweight and fast  

---

## Installation

### 1. Clone the repository
```bash
git clone https://github.com/medc-0/devradar-cli.git
cd devradar-cli
```

### 2. Install dependencies
```bash
npm install
```

### 3. Link globally (optional)
```bash
npm link
```

Now you can run the CLI from anywhere using:

```bash
devradar scan "C:\Users\(Your user)\Projects" --html
```

---

## Usage Examples

**Scan projects (default table output):**
```bash
devradar scan "C:\Users\(Your user)\Projects"
```

**Export JSON report:**
```bash
devradar scan "C:\Users\(Your user)\Projects" --json
```

**Export HTML report:**
```bash
devradar scan "C:\Users\(Your user)\Projects" --html
```

### Example Table Output
| Project   | Languages                  | Lines | Last Commit  |
|-----------|---------------------------|-------|--------------|
| Proj1     | Python (78.5%), JS (21.5%)| 1420  | 2025-10-25   |
| Websites  | HTML (60.3%), CSS (25.2%), JS (14.5%) | 824 | — |

### Example HTML Report Preview

---

## Tips & Tricks

- Use DevRadar to track your coding progress weekly  
- Include HTML/JSON reports in your portfolio  

---

## Contribution

Pull requests, bug reports, and feature suggestions are welcome!

1. Fork the repo  
2. Create a feature branch:
```bash
git checkout -b feature-name
```
3. Commit your changes:
```bash
git commit -m "Add feature"
```
4. Push to your branch:
```bash
git push origin feature-name
```
5. Open a pull request  

---

## License

This project is licensed under the MIT License.  
See [LICENSE](LICENSE) for details.

