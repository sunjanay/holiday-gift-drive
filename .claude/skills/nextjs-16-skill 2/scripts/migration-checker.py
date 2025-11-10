#!/usr/bin/env python3
"""
Next.js 16 Migration Checker

Scans your Next.js project for common migration issues and provides
guidance on updating to Next.js 16.
"""

import os
import re
import sys
from pathlib import Path
from typing import List, Dict, Tuple

class Colors:
    """Terminal colors for output"""
    RED = '\033[91m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    MAGENTA = '\033[95m'
    CYAN = '\033[96m'
    RESET = '\033[0m'
    BOLD = '\033[1m'

def print_header(text: str):
    """Print section header"""
    print(f"\n{Colors.BOLD}{Colors.CYAN}{'=' * 60}{Colors.RESET}")
    print(f"{Colors.BOLD}{Colors.CYAN}{text}{Colors.RESET}")
    print(f"{Colors.BOLD}{Colors.CYAN}{'=' * 60}{Colors.RESET}\n")

def print_issue(severity: str, file: str, line: int, message: str):
    """Print an issue found"""
    color = Colors.RED if severity == "ERROR" else Colors.YELLOW
    print(f"{color}[{severity}]{Colors.RESET} {file}:{line}")
    print(f"  → {message}\n")

def check_package_json(project_dir: Path) -> Dict[str, List[Tuple[str, str]]]:
    """Check package.json for version requirements"""
    issues = {"errors": [], "warnings": []}
    package_json = project_dir / "package.json"
    
    if not package_json.exists():
        issues["errors"].append(("package.json", "File not found"))
        return issues
    
    with open(package_json, 'r') as f:
        content = f.read()
        
        # Check Next.js version
        next_match = re.search(r'"next":\s*"([^"]+)"', content)
        if next_match:
            version = next_match.group(1)
            if not version.startswith('^16') and not version.startswith('~16'):
                issues["warnings"].append(
                    (str(package_json), 
                     f"Next.js version '{version}' should be updated to 16.x")
                )
        
        # Check Node.js version in engines
        node_match = re.search(r'"node":\s*"([^"]+)"', content)
        if node_match:
            version = node_match.group(1)
            if not ('20' in version or '>=' in version):
                issues["errors"].append(
                    (str(package_json),
                     f"Node.js version '{version}' should be 20.9.0+")
                )
        
        # Check TypeScript version
        ts_match = re.search(r'"typescript":\s*"([^"]+)"', content)
        if ts_match:
            version = ts_match.group(1)
            # Simple check - could be improved
            if '5.0' in version or '4.' in version:
                issues["warnings"].append(
                    (str(package_json),
                     f"TypeScript version '{version}' should be 5.1.0+")
                )
    
    return issues

def check_async_params(file_path: Path) -> List[Tuple[int, str]]:
    """Check for synchronous params/searchParams usage"""
    issues = []
    
    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
        lines = f.readlines()
        
        for i, line in enumerate(lines, 1):
            # Check for synchronous params usage
            if 'params:' in line and 'Promise<' not in line:
                if 'export' in line or 'function' in line or 'const' in line:
                    issues.append((i, "params should be Promise<...>"))
            
            # Check for synchronous searchParams usage
            if 'searchParams:' in line and 'Promise<' not in line:
                if 'export' in line or 'function' in line or 'const' in line:
                    issues.append((i, "searchParams should be Promise<...>"))
            
            # Check for params access without await
            if re.search(r'params\.(\w+)', line) and 'await params' not in line:
                if 'const' not in line or '= await params' not in line:
                    issues.append((i, "params must be awaited before access"))
    
    return issues

def check_async_headers_cookies(file_path: Path) -> List[Tuple[int, str]]:
    """Check for synchronous headers/cookies/draftMode usage"""
    issues = []
    
    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
        lines = f.readlines()
        
        for i, line in enumerate(lines, 1):
            # Check for synchronous cookies() usage
            if 'cookies()' in line and 'await cookies()' not in line:
                issues.append((i, "cookies() must be awaited"))
            
            # Check for synchronous headers() usage
            if 'headers()' in line and 'await headers()' not in line:
                issues.append((i, "headers() must be awaited"))
            
            # Check for synchronous draftMode() usage
            if 'draftMode()' in line and 'await draftMode()' not in line:
                issues.append((i, "draftMode() must be awaited"))
    
    return issues

def check_revalidate_tag(file_path: Path) -> List[Tuple[int, str]]:
    """Check for old revalidateTag signature"""
    issues = []
    
    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
        lines = f.readlines()
        
        for i, line in enumerate(lines, 1):
            # Check for single-argument revalidateTag
            match = re.search(r'revalidateTag\([\'"][\w-]+[\'"](\)|,)', line)
            if match and match.group(1) == ')':
                issues.append((
                    i,
                    "revalidateTag() requires second argument (cacheLife profile)"
                ))
    
    return issues

def check_middleware_file(project_dir: Path) -> Dict[str, str]:
    """Check if middleware.ts exists and should be renamed"""
    issues = {}
    
    middleware_files = [
        project_dir / "middleware.ts",
        project_dir / "middleware.js",
        project_dir / "src" / "middleware.ts",
        project_dir / "src" / "middleware.js",
    ]
    
    for file in middleware_files:
        if file.exists():
            issues[str(file)] = "Should be renamed to proxy.ts"
    
    return issues

def check_parallel_routes(project_dir: Path) -> Dict[str, str]:
    """Check for parallel routes missing default.js"""
    issues = {}
    app_dir = project_dir / "app"
    
    if not app_dir.exists():
        return issues
    
    # Find all parallel route directories (starting with @)
    for item in app_dir.rglob("@*"):
        if item.is_dir():
            default_files = [
                item / "default.tsx",
                item / "default.ts",
                item / "default.jsx",
                item / "default.js",
            ]
            
            if not any(f.exists() for f in default_files):
                issues[str(item)] = "Missing default.tsx file"
    
    return issues

def scan_project(project_dir: str):
    """Main scanning function"""
    project_path = Path(project_dir)
    
    if not project_path.exists():
        print(f"{Colors.RED}Error: Directory '{project_dir}' not found{Colors.RESET}")
        sys.exit(1)
    
    print_header("Next.js 16 Migration Checker")
    print(f"Scanning: {project_path.absolute()}\n")
    
    total_issues = 0
    
    # Check package.json
    print_header("1. Checking Dependencies")
    pkg_issues = check_package_json(project_path)
    for file, message in pkg_issues["errors"]:
        print_issue("ERROR", file, 0, message)
        total_issues += 1
    for file, message in pkg_issues["warnings"]:
        print_issue("WARNING", file, 0, message)
        total_issues += 1
    
    # Check middleware
    print_header("2. Checking Middleware")
    middleware_issues = check_middleware_file(project_path)
    for file, message in middleware_issues.items():
        print_issue("WARNING", file, 0, message)
        total_issues += 1
    
    # Check parallel routes
    print_header("3. Checking Parallel Routes")
    parallel_issues = check_parallel_routes(project_path)
    for directory, message in parallel_issues.items():
        print_issue("ERROR", directory, 0, message)
        total_issues += 1
    
    # Scan TypeScript/JavaScript files
    print_header("4. Checking TypeScript/JavaScript Files")
    
    search_dirs = [project_path / "app", project_path / "src"]
    extensions = ['.ts', '.tsx', '.js', '.jsx']
    
    for search_dir in search_dirs:
        if not search_dir.exists():
            continue
        
        for ext in extensions:
            for file_path in search_dir.rglob(f"*{ext}"):
                # Skip node_modules and .next
                if 'node_modules' in str(file_path) or '.next' in str(file_path):
                    continue
                
                # Check async params
                param_issues = check_async_params(file_path)
                for line_num, message in param_issues:
                    print_issue("ERROR", str(file_path.relative_to(project_path)), line_num, message)
                    total_issues += 1
                
                # Check async headers/cookies
                header_issues = check_async_headers_cookies(file_path)
                for line_num, message in header_issues:
                    print_issue("ERROR", str(file_path.relative_to(project_path)), line_num, message)
                    total_issues += 1
                
                # Check revalidateTag
                revalidate_issues = check_revalidate_tag(file_path)
                for line_num, message in revalidate_issues:
                    print_issue("WARNING", str(file_path.relative_to(project_path)), line_num, message)
                    total_issues += 1
    
    # Summary
    print_header("Summary")
    if total_issues == 0:
        print(f"{Colors.GREEN}✓ No migration issues found!{Colors.RESET}")
        print(f"{Colors.GREEN}Your project appears ready for Next.js 16.{Colors.RESET}\n")
    else:
        print(f"{Colors.YELLOW}Found {total_issues} potential issues.{Colors.RESET}\n")
        print("Next steps:")
        print(f"  1. Run automated migration: {Colors.CYAN}npx @next/codemod@canary upgrade latest{Colors.RESET}")
        print(f"  2. Review the issues above and fix manually if needed")
        print(f"  3. Test your application thoroughly\n")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        project_dir = sys.argv[1]
    else:
        project_dir = "."
    
    scan_project(project_dir)
