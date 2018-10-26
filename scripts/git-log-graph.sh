latest_tag=$(git describe --abbrev=0 --tags)
git rev-list --oneline --abbrev-commit --graph $latest_tag..HEAD
